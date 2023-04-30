import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {

  @IsEmail({}, {
    message: "El email de recuperación no es correcto"
  })
  @IsOptional()
  readonly emailRecuperacion: string | undefined;


  @IsString({
    message: "El nombre debe ser un texto"
  })
  readonly nombre: string;
}
