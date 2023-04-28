import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, {
    message: "El email no es correcto"
  })
  readonly email: string;

  @IsEmail({}, {
    message: "El email no es correcto"
  })
  @IsOptional()
  readonly emailRecuperacion: string | undefined;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, {
    message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
  })
  readonly password: string;

  @IsString({
    message: "El nombre debe ser un texto"
  })
  readonly nombre: string;
}
