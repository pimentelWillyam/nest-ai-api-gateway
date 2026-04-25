import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { bold, cyan, green, yellow, magenta } from 'picocolors'

interface RouteDefinition {
  method: string
  path: string
}

@Injectable()
export class RoutesPrinterHelper {
  private readonly ROUTES: RouteDefinition[] = [
    { method: 'POST', path: '/user' },
    { method: 'GET', path: '/user' },
    { method: 'GET', path: '/user/:id' },
    { method: 'PATCH', path: '/user/:id' },
    { method: 'DELETE', path: '/user/:id' },
    { method: 'POST', path: '/user/:id/access/:serviceId' },
    { method: 'DELETE', path: '/user/:id/access/:serviceId' },
    { method: 'GET', path: '/user/:id/access' },
    { method: 'POST', path: '/auth/login' },
    { method: 'POST', path: '/ai-services' },
    { method: 'GET', path: '/ai-services' },
    { method: 'GET', path: '/ai-services/:id' },
    { method: 'PATCH', path: '/ai-services/:id' },
    { method: 'DELETE', path: '/ai-services/:id' },
    { method: 'GET', path: '/ai-services/:id/users' },
  ]

  constructor(private readonly configService: ConfigService) {}

  print(): void {
    const host = this.configService.get<string>('host') ?? 'localhost'
    const port = this.configService.get<number>('port') ?? 3000
    console.log(bold(cyan(`Server is running on port ${port}`)))
    console.log(bold('Available routes:'))

    this.ROUTES.forEach((route) => {
      const method = route.method.padEnd(6)
      console.log(
        `${green(`${method}`)} ${yellow(`http://${host}:${port}${route.path}`)}`,
      )
    })

    console.log(magenta('Press CTRL+C to stop the server.'))
  }
}
