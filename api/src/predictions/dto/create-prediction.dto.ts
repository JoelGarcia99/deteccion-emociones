import { Type } from "class-transformer";
import { IsEnum, IsObject, IsString, ValidateNested } from "class-validator";
import { CreateMediaDto } from "src/media/dto/create-media.dto";

export class CreatePredictionDto {
  @IsEnum(
    [
      'fear',
      'happy',
      'neutral',
      'angry',
      'sad',
      'surprise',
    ],
    {
      message: "La emoción ingresada no es soportada"
    }
  )
  emocionDetectada: string;

  @IsString({ message: "El id del recurso no es válido" })
  recursoId: string;

  @ValidateNested({ always: true })
  @Type(() => CreateMediaDto)
  media: CreateMediaDto;
}
