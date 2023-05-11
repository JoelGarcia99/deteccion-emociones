import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { ISignUpResponse } from './interfaces/signup.response';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from './interfaces/jwt.payload';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

      return {
        user: dbUser,
        token,
        refreshToken: '',
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

    const token = this.getJwtToken(payload);

    return {
      user,
      token,
      refreshToken: '',
    }
  }

  private getJwtToken(payload: IJWTPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
}
