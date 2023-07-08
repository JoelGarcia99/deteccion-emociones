import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    TypeOrmModule.forFeature([Media]),
    NestjsFormDataModule
  ]
})
export class MediaModule { }
