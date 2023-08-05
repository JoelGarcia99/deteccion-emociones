import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/strategy.jwt';
import { MailUtil } from 'src/utils/mail.util';
import { SecurityUtil } from 'src/utils/security.util';

const jwtRegistration = JwtModule.registerAsync({
  imports: [],
  useFactory: () => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
  }),
});

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    MailUtil,
    SecurityUtil,
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    jwtRegistration,
  ],
  exports: [
    jwtRegistration,
  ]
})
export class AuthModule { }
