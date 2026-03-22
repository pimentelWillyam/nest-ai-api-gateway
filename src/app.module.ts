import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from './infra/database/prisma.module'
import { AppConfig } from './config/app-config'

@Module({
  imports: [ConfigModule.forRoot(AppConfig.getConfigModuleOptions()), UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
