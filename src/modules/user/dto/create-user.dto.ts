import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email!: string

  @IsString()
  login!: string

  @IsString()
  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  password!: string
}
