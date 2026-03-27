import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiServicesService } from './ai-services.service';
import { CreateAiServiceDto } from './dto/create-ai-service.dto';
import { UpdateAiServiceDto } from './dto/update-ai-service.dto';

@Controller('ai-services')
export class AiServicesController {
  constructor(private readonly aiServicesService: AiServicesService) {}

  @Post()
  create(@Body() createAiServiceDto: CreateAiServiceDto) {
    return this.aiServicesService.create(createAiServiceDto);
  }

  @Get()
  findAll() {
    return this.aiServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiServiceDto: UpdateAiServiceDto) {
    return this.aiServicesService.update(+id, updateAiServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiServicesService.remove(+id);
  }
}
