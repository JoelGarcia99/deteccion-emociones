import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import * as fs from 'fs';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {

  private filesPath = `${__dirname}/../../files/`;

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) { }

  async create(createMediaDto: CreateMediaDto) {

    const mediaFile = createMediaDto.file;

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
    delete createMediaDto.file;

    return await this.mediaRepository.save({
      ...createMediaDto,
      url: imageEndpoint,
    });
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
