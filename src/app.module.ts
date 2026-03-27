import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from './infra/database/prisma.module'
import { AppConfig } from './config/app-config'
import { AiModule } from './ai/ai.module';
import { AiServiceModule } from './modules/ai-services/ai-services.module';
import { AiServicesModule } from './modules/ai-services/ai-services.module';
import { AuthModule } from './modules/auth/auth.module';
import { AiServiceModule } from './modules/ai-services/ai-services.module';

@Module({
  imports: [ConfigModule.forRoot(AppConfig.getConfigModuleOptions()), UserModule, PrismaModule, AiModule, AiServiceModule, AuthModule, AiServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
