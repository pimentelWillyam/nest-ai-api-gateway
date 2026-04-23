import { IsString, MinLength } from 'class-validator'

export class LoginAuthDto {
  @IsString()
  login!: string

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string
}
