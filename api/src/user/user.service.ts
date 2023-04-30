import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUIDUtil } from 'src/utils/uuid.util';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly uuidUtil: UUIDUtil,
  ) { }

  async findOne(id: string) {

    // checking if [id] is a valid uuid
    if (!this.uuidUtil.validate(id)) {
      throw new NotFoundException('Usuario no existe');
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    // removing password
    delete user.password;

    if (!user) {
      throw new NotFoundException('Usuario no existe');
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {

    // checking if [id] is a valid uuid
    if (!this.uuidUtil.validate(id)) {
      throw new NotFoundException('Usuario no existe');
    }

    return this.userRepository.update(id, updateUserDto);
  }
}
