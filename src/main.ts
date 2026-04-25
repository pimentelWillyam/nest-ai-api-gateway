import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { RoutesPrinterHelper } from './helpers/routes-printer.helper'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  const configService = app.get(ConfigService)
  const routesPrinter = app.get(RoutesPrinterHelper)
  const port = configService.get<number>('port') ?? 3000

  await app.listen(port)
  routesPrinter.print()
}

void bootstrap()
