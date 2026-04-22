import { bold, cyan, green, yellow, magenta } from 'picocolors'

interface RouteDefinition {
  method: string
  path: string
}

export class RoutesPrinterHelper {
  private static readonly ROUTES: RouteDefinition[] = [
    { method: 'POST', path: '/user' },
    { method: 'GET', path: '/user' },
    { method: 'GET', path: '/user/:id' },
    { method: 'PATCH', path: '/user/:id' },
    { method: 'DELETE', path: '/user/:id' },
    { method: 'POST', path: '/auth/login' },
    { method: 'POST', path: '/ai-services' },
    { method: 'GET', path: '/ai-services' },
    { method: 'GET', path: '/ai-services/:id' },
    { method: 'PATCH', path: '/ai-services/:id' },
    { method: 'DELETE', path: '/ai-services/:id' },
  ]

  static print(host: string, port: number): void {
    console.log(bold(cyan(`Server is running on port ${port}`)))
    console.log(bold('Available routes:'))

    this.ROUTES.forEach(route => {
      const method = route.method.padEnd(6)
      console.log(`${green(`${method}`)} ${yellow(`http://${host}:${port}${route.path}`)}`)
    })

    console.log(magenta('Press CTRL+C to stop the server.'))
  }
}