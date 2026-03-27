import { Module } from '@nestjs/common';
import { AiServicesService } from './ai-services.service';
import { AiServicesController } from './ai-services.controller';

@Module({
  controllers: [AiServicesController],
  providers: [AiServicesService],
})
export class AiServicesModule {}
