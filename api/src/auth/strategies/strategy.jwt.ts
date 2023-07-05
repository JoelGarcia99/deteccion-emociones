import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "../auth.service";

export interface AccessTokenPayload {
  userId: string;
  exp?: number | undefined;
}

export interface JwtStrategyOutput {
  user: User,
  accessToken: string;
}

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: AccessTokenPayload): Promise<JwtStrategyOutput> {
    console.log("Validation enteirng")
    const bearerToken = req.headers['authorization'].split(' ')[1];

    // getting the new access token 
    let accessToken: string | null;

    try {
      accessToken = await this.authService.checkAccessToken(bearerToken);
    } catch (e) {
      console.error(e);
      throw e;
    }

    if (!accessToken) {
      throw new UnauthorizedException("Invalid access token");
    }

    const user = await this.userRepository.findOne({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Inactive session");
    }

    return {
      user,
      accessToken,
    };
  }
}
