
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(err: any, straOutput: any, info: Error) {

    console.log("Handling request");
    if (info || !straOutput) {
      console.error("info", info);
      console.error("straOutput", straOutput);
      throw new UnauthorizedException(info?.message ?? 'Unauthorized');
    }

    if (err) {
      console.error("err", err);
      throw err;
    }

    return straOutput;
  }
}
