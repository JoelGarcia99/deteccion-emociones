import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { Prediction } from './entities/prediction.entity';
import * as fs from 'fs';

@Injectable()
export class PredictionsService {

  private filesPath = `${__dirname}/../../files/`;

  constructor(
    @InjectRepository(Prediction)
    private readonly predictionsRepository: Repository<Prediction>,
  ) { }


  async create(usuarioId: string, createPredictionDto: CreatePredictionDto) {

    if (!createPredictionDto.media) {
      throw new BadRequestException(["El campo 'media' es necesario"]);
    }

    const mediaFile = createPredictionDto.media.file;

    const fileExtension = mediaFile.originalName.split('.').pop();
    const fileName = `${v4()}.${fileExtension}`;

    // copying the file to the local folder
    if (!fs.existsSync(this.filesPath)) {
      fs.mkdirSync(this.filesPath, { recursive: true });
    }

    fs.writeFileSync(
      `${this.filesPath}${fileName}`,
      mediaFile.buffer,
    );

    // extracting the host & port being used
    const host = process.env.API_HOST;
    const port = process.env.API_PORT;

    const imageProtocol = host === 'localhost' ? 'http' : 'https';
    const imageHost = `www.${host}:${port}`;
    const imageEndpoint = `${imageProtocol}://${imageHost}/api/images/${fileName}`;

    // removing image buffer to don't send it to the client
    delete createPredictionDto.media.file;

    const createdEntity = this.predictionsRepository.create({
      ...createPredictionDto,
      media: {
        ...createPredictionDto.media,
        url: imageEndpoint,
      },
      usuarioId,
    });

    console.log(createdEntity);
    return await this.predictionsRepository.save(createdEntity);
  }

  async findAll(usuarioId: string) {
    return await this.predictionsRepository.find({
      where: {
        usuarioId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} prediction`;
  }

  update(id: number, updatePredictionDto: UpdatePredictionDto) {
    return `This action updates a #${id} prediction`;
  }

  remove(id: number) {
    return `This action removes a #${id} prediction`;
  }
}
