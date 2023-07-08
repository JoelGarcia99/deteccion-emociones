import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller('images')
export class ImagesController {

  private filesPath = `${__dirname}/../../files/`;

  constructor() { }

  @Get(':fileName')
  findOne(@Res() res: any, @Param('fileName') fileName: string) {
    res.sendFile(`${fileName}`, { root: `${this.filesPath}` });
  }
}
