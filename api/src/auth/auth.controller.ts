import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  // @UseGuards(AuthGuard(), JwtAuthGuard)
  async signUp(@Body() signUp: SignUpDto) {
    return await this.authService.signUp(signUp);
  }

  @Post('signin')
  async signIn(@Body() signIn: SignInDto) {
    return await this.authService.signIn(signIn);
  }
}
