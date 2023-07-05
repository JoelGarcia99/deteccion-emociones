import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateResourceDto {
  @IsString({ message: "El nombre no es válido" })
  nombre: string;

  @IsEnum(["video", "videogame"], { message: "El tipo no es válido" })
  @IsOptional()
  tipo: string;

  @IsString({ message: "El URL no es válido" })
  @IsOptional()
  url?: string;

  @IsString({ message: "El embebido no es válido" })
  @IsOptional()
  embebido?: string;
}
