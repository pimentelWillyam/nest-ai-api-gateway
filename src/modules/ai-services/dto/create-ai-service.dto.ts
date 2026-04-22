import { IsString, IsUrl, MinLength } from 'class-validator'

export class CreateAiServiceDto {
  @IsString()
  model!: string

  @IsString()
  slug!: string

  @IsUrl()
  url!: string
}
