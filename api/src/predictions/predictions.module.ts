import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { FormDataRequest, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [PredictionsController],
  providers: [PredictionsService],
  imports: [
    TypeOrmModule.forFeature([Prediction]),
    NestjsFormDataModule,
  ],
})
export class PredictionsModule { }
