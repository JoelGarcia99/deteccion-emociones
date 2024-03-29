import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { joiValidationSchema } from './config/joi.config';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { UtilsModule } from './utils/utils.module';
import { DeepfaceModule } from './deepface/deepface.module';
import { ResourcesModule } from './resources/resources.module';
import { MediaModule } from './media/media.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { ImagesModule } from './images/images.module';
import { PredictionsModule } from './predictions/predictions.module';

@Module({
  imports: [
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    ConfigModule.forRoot({ validationSchema: joiValidationSchema }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
    }),
    UserModule, AuthModule, UtilsModule,
    DeepfaceModule, ResourcesModule, MediaModule, ImagesModule, PredictionsModule,
  ],
})
export class AppModule { }
