import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJWTPayload } from "../interfaces/jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJWTPayload): Promise<User> {
    const { id } = payload;

    // looking for the user in the database
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // TODO: validate inactive users
    // ....

    // this will be added to the request automatically
    return user;
  }
}
