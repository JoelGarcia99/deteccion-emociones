import { Module } from '@nestjs/common';
import { UUIDUtil } from './uuid.util';

@Module({
  providers: [UUIDUtil],
  exports: [
    UUIDUtil,
  ]
})
export class UtilsModule { }
