import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtStrategyOutput } from 'src/auth/strategies/strategy.jwt';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('prediccion')
@UseGuards(JwtAuthGuard)
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) { }

  @Post()
  @FormDataRequest()
  async create(@Req() request: Request, @Body() createPredictionDto: CreatePredictionDto) {

    const jwtRespone = request['user'] as JwtStrategyOutput;

    return await this.predictionsService.create(jwtRespone.user.id, createPredictionDto);
  }

  @Get()
  async findAllForCurrentUser(@Req() request: Request) {

    const jwtRespone = request['user'] as JwtStrategyOutput;

    return await this.predictionsService.findAll(jwtRespone.user.id);
  }
}
