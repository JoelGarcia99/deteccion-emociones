import { IsEnum } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class CreateMediaDto {
  @IsFile()
  @MaxFileSize(5 * 1024 * 1024)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'])
  file: MemoryStoredFile;

  @IsEnum(['image'])
  tipo: string;
}
