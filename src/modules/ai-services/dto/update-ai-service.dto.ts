import { PartialType } from '@nestjs/mapped-types'
import { CreateAiServiceDto } from './create-ai-service.dto'

export class UpdateAiServiceDto extends PartialType(CreateAiServiceDto) {}
