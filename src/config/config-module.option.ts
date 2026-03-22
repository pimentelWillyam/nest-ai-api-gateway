const ENVIRONMENTS = ['dev', 'prod', 'test'] as const
type Environment = (typeof ENVIRONMENTS)[number]

function getEnvironment(): Environment {
  const env = process.env.NODE_ENV ?? 'dev'
  if (ENVIRONMENTS.includes(env as Environment)) {
    return env as Environment
  }
  return 'dev'
}

const configuration = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
})

function getEnvFilePaths(env: Environment): string[] {
  return [`.env.${env}`, '.env']
}

export function getConfigModuleOptions() {
  const env = getEnvironment()
  const envFilePaths = getEnvFilePaths(env)

  return {
    isGlobal: true,
    load: [configuration],
    envFilePath: envFilePaths,
    ignoreEnvFile: env === 'prod' && !process.env.DATABASE_URL?.startsWith('file:'),
  }
}
