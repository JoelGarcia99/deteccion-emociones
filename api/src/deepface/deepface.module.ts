import { Module } from '@nestjs/common';
import { PythonDeepFaceGateway } from './python_api_connetion';

@Module({
  providers: [PythonDeepFaceGateway]
})
export class DeepfaceModule { }
