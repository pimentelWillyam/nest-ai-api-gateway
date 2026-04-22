import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { RoutesPrinterHelper } from './helpers/routes-printer.helper'

export class Application {
  private static getValidationPipe() {
    return new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  }

  static async execute() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(Application.getValidationPipe())
    const configService = app.get(ConfigService)
    const port = configService.get<number>('port') ?? 3000
    const host = configService.get<string>('host') ?? 'localhost'
    await app.listen(port)
    RoutesPrinterHelper.print(host,port)
  }
}

void Application.execute()
