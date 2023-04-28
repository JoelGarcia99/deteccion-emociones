
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  /**
  * Verificacion basada en la filosofia de rotation refresh tokens
  */
  async canActivate(context: ExecutionContext) {

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    console.log({ user });

    return true;
  }
}
