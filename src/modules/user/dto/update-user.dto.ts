import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  login?: string

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  password?: string
}
