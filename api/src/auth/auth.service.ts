import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { TokenExpiredError } from "jsonwebtoken";
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { ISignUpResponse } from './interfaces/signup.response';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from './interfaces/jwt.payload';
import { SignInDto } from './dto/signin.dto';
import { AccessTokenPayload } from './strategies/strategy.jwt';
import { MailUtil } from 'src/utils/mail.util';
import { SecurityUtil } from 'src/utils/security.util';

export class RefreshTokenPayload {
  userId: string;
  exp?: number | undefined;
}

@Injectable()
export class AuthService {

  async recoverPassword(body: { email: string; }) {
    const { email } = body;

    // searching if the user exists 
    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('Usuario no existe');
    }

    // generating new password 
    const pass = this.securityUtil.generatePassword();

    // encrypting the password
    const hashedPassword = bcrypt.hashSync(pass, 10);

    // updating the user
    user.password = hashedPassword;

    await this.userRepository.save(user);

    // mailing the new password to the user 
    await this.mailService.sendEmail({
      to: [
        {
          email: user.email,
          name: user.nombre,
        },
      ],
      subject: "Recuperación de contraseña",
      textPart: "Recuperación de contraseña",
      htmlPart: `Su contraseña es ${pass}`,
    });

    return {
      message: "Se ha enviado un correo de recuperacion"
    }
  }

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailUtil,
    private readonly securityUtil: SecurityUtil,
  ) { }

  async signUp(signUp: SignUpDto): Promise<ISignUpResponse> {
    // extrayendo credenciales de usuario
    const { password } = signUp;

    // cifrando password
    const hashedPassword = bcrypt.hashSync(password, 10);
    const dtoUser = this.userRepository.create({
      ...signUp,
      password: hashedPassword,
      updatedAt: new Date(),
      createdAt: new Date(),
    });


    try {
      const dbUser = await this.userRepository.save(dtoUser);
      // La password no debe ser mostrada
      delete dbUser.password;

      // generando payload para el token
      const payload: IJWTPayload = {
        id: dbUser.id,
      };

      // generating tokens
      const token = this.getJwtToken(payload);
      const refreshToken = await this.createRefreshToken(dbUser);

      return {
        user: dbUser,
        token,
      }
    } catch (e) {

      if (e.code === '23505' && e.detail.includes('email')) {
        throw new BadRequestException({
          error: 'El correo ya existe',
          detail: e.detail,
        });
      }

      console.error(e);
    }

    // Si este punto es alcanzado eso significa que hubo un error
    // desconocido
    throw new InternalServerErrorException();
  }

  async signIn(signIn: SignInDto): Promise<ISignUpResponse> {
    const { email, password } = signIn;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException({
        error: 'Credenciales incorrectas',
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException({
        error: 'Credenciales incorrectas',
      });
    }

    // removing the password
    delete user.password;

    const payload: IJWTPayload = {
      id: user.id,
    }

    await this.createRefreshToken(user);
    const token = this.getJwtToken(payload);

    return {
      user,
      token,
    }
  }

  private getJwtToken(payload: IJWTPayload) {

    const token = this.jwtService.sign(payload);

    return token;
  }

  /**
   * It'll create & store a determined refresh token into user session
   *
   * @return {string} session ID
   */
  async createRefreshToken(user: User): Promise<string> {

    const payload: RefreshTokenPayload = {
      userId: user.id,
    }

    // generating & signing our refresh token
    const refreshToken = this.jwtService.sign(
      payload,
      {
        expiresIn: '30d',
        secret: process.env.JWT_SECRET
      },
    );

    // creating the session object
    await this.userRepository.update(user.id, {
      refreshToken,
      updatedAt: new Date(),
    });

    return refreshToken;
  }

  /**
   * It will update the current refresh token & letting useless the 
   * previous RTs & ATs
   *
   * @param {string} userId - user ID
   */
  async updateRefreshToken(userId: string): Promise<void> {

    const payload: RefreshTokenPayload = {
      userId,
    }

    // generating & signing our refresh token
    const refreshToken = this.jwtService.sign(
      payload,
      {
        expiresIn: '30d',
        secret: process.env.JWT_SECRET
      },
    );

    // updating the current refresh token
    await this.userRepository.update(userId, {
      refreshToken, updatedAt: new Date()
    });
  }

  /**
   * It'll create & store a determined access token linked to a RT.
   * TODO: revoke old access tokens
   *
   * @param {string} rtId - refresh token ID
   * @param {string} userId - user ID
   *
   * @return {string} access token
   */
  async createAccessToken(userId: string): Promise<string> {

    const payload: AccessTokenPayload = {
      userId
    }

    const accessToken = this.jwtService.sign(
      payload,
      {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET
      },
    );

    return accessToken;
  }

  /**
   * Checks if a refresh token is still present on the DB and if it's valid
   *
   * @param {string} refreshToken
   * @param {Session} session - pass it if you want to update an existing session
   *
   * @return {boolean} true if the refresh token is still valid
   */
  async checkRefreshToken(refreshToken: string): Promise<boolean> {

    const dbUser = await this.userRepository.findOne({
      where: {
        refreshToken,
      },
    });

    // if the session doesn't exist it mean the RT is corrupt
    if (!dbUser) {
      throw new UnprocessableEntityException('Refresh token no válido');
    }

    const decodedToken: RefreshTokenPayload | null = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
      ignoreExpiration: true,
    });


    // checking if it's valid
    if (!decodedToken) {
      throw new UnprocessableEntityException('Refresh token no válido');
    }

    if (decodedToken.userId !== dbUser.id) {
      throw new UnprocessableEntityException('Refresh token no válido');
    }

    // checking expiration time
    const isExpired = decodedToken.exp * 1000 < Date.now();

    // if expired then remove it from DB
    if (isExpired) {
      // NOTE: it's okay to keep it async to save resources
      this.userRepository.update(dbUser.id, { refreshToken: null });

      // letting the client know it's expired
      throw new TokenExpiredError("Su sesión ha expirado", new Date(decodedToken.exp! * 1000));
    }

    return !isExpired;
  }

  /**
  * Whereas the access token is valid depends on the response, if it's a string 
  * then it's the access token, othersise it means the access token is not valid 
  * and it cannot be updated
  *
  * @param {string} accessToken
  *
  * @return {string | null} Returns the access token or null if it's invalid or 
  * cannot be renueved
  */
  async checkAccessToken(accessToken: string): Promise<string | null> {
    const decodedToken: AccessTokenPayload | null = this.jwtService.verify(accessToken, {
      secret: process.env.JWT_SECRET,
      ignoreExpiration: true,
    });

    // first security layer: checking integrity
    if (!decodedToken) {
      throw new UnprocessableEntityException('Invalid access token');
    }

    // next security layer: checking correspondence
    const { userId } = decodedToken;

    const dbUser: User | null = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!dbUser) {
      throw new UnprocessableEntityException('Invalid access token');
    }

    // next security layer: checking expiration time
    const isExpired = (decodedToken.exp * 1000) < Date.now();
    console.log("Token expired")

    // if AT is expired then try to search for the refreshToken to determine if 
    // it's possible to update it or not
    if (isExpired) {
      // checking integrity of the refresh token
      const isRtValid = await this.checkRefreshToken(dbUser.refreshToken);

      if (!isRtValid) {
        throw new TokenExpiredError("Su sesión ha expirado", new Date(decodedToken.exp * 1000));
      }
      // updating the refresh token
      await this.updateRefreshToken(userId);
      return await this.createAccessToken(userId);
    }

    // if the token is still valid the just return it
    return accessToken;
  }

  /**
  * It'll decode the access token returning its payload for different purposes
  *
  * @param {string} accessToken
  */
  async decodeAccessToken(accessToken: string): Promise<AccessTokenPayload> {
    return this.jwtService.verify(accessToken, {
      secret: process.env.JWT_SECRET,
    });
  }
}
