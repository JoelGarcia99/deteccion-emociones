import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe(
      {
        // lanza una excepcion si no se encuentra el campo
        forbidNonWhitelisted: true,
        whitelist: true
      }
    )
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.API_PORT);
}
bootstrap();
