import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'
import { User } from '../user/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
