import { IsEmail, IsString } from 'class-validator'

export class DeleteUserDTO {
  @IsString()
  login?: string

  @IsString()
  password?: string

  @IsEmail()
  email?: string
}
