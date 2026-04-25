import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { AiServicesModule } from './modules/ai-services/ai-services.module'
import { AppConfig } from './config/app-config'
import { DatabaseModule } from './infra/database/database.module'
import { RoutesPrinterHelper } from './helpers/routes-printer.helper'

@Module({
  imports: [
    ConfigModule.forRoot(AppConfig.getConfigModuleOptions()),
    DatabaseModule,
    UserModule,
    AuthModule,
    AiServicesModule,
  ],
  providers: [RoutesPrinterHelper]
})
export class AppModule {}
