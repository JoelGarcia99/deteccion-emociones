import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtStrategyOutput } from 'src/auth/strategies/strategy.jwt';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post()
  @FormDataRequest()
  async create(@Body() createMediaDto: CreateMediaDto) {
    return await this.mediaService.create(createMediaDto);
  }

  @Get()
  async findAllForCurrentUser(@Req() request: Request) {

    const jwtRespone = request['user'] as JwtStrategyOutput;

    return await this.mediaService.findAll(jwtRespone.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
