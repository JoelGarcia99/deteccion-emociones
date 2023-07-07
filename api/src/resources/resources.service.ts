import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) { }

  async create(createResourceDto: CreateResourceDto) {
    return await this.resourceRepository.save(createResourceDto);
  }

  async findAll() {
    const resources = await this.resourceRepository.find();

    const resourcesMap: Map<string, Resource[]> = new Map();

    // mapping all and building the final JSON grouped by the detected
    // emotion
    resources.forEach((resource) => {
      resourcesMap[resource.proposito] = [
        ...(resourcesMap[resource.proposito] ?? []),
        resource,
      ];
    });

    return resourcesMap;
  }
}
