import { Controller, Get, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtStrategyOutput } from 'src/auth/strategies/strategy.jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() request: Request) {

    const output = request['user'] as JwtStrategyOutput;

    console.log("output", output);
    const id = output.user.id;

    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }
}
