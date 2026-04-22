import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AiServicesController } from './ai-services.controller'
import { AiServicesService } from './ai-services.service'
import { AiService } from './ai-service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AiService])],
  controllers: [AiServicesController],
  providers: [AiServicesService],
})
export class AiServicesModule {}
