import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { AiServicesService } from './ai-services.service'
import { CreateAiServiceDto } from './dto/create-ai-service.dto'
import { UpdateAiServiceDto } from './dto/update-ai-service.dto'
import { AiServiceAccessGuard } from '../auth/ai-service-access.guard'

@Controller('ai-services')
export class AiServicesController {
  constructor(private readonly aiServicesService: AiServicesService) {}

  @Post()
  create(@Body() createAiServiceDto: CreateAiServiceDto) {
    return this.aiServicesService.create(createAiServiceDto)
  }

  @Get()
  findAll() {
    return this.aiServicesService.findAll()
  }

  @UseGuards(AiServiceAccessGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.aiServicesService.findOne(id)
  }

  @UseGuards(AiServiceAccessGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAiServiceDto: UpdateAiServiceDto,
  ) {
    return this.aiServicesService.update(id, updateAiServiceDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.aiServicesService.remove(id)
  }

  @Get(':id/users')
  getUsersWithAccess(@Param('id', ParseUUIDPipe) id: string) {
    return this.aiServicesService.getUsersWithAccess(id)
  }
}
