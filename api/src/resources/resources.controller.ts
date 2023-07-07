import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @Post()
  async create(@Body() createResourceDto: CreateResourceDto) {
    return await this.resourcesService.create(createResourceDto);
  }

  @Get()
  async findAll() {
    return await this.resourcesService.findAll();
  }
}
