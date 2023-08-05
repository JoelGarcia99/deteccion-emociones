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

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, {
    message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
  })
  @IsOptional()
  readonly password: string;
}
