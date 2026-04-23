import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'

@Injectable()
export class AiServiceAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user // Assumindo que o usuário está no request via JWT
    const aiServiceId = request.params.id // Assumindo que o ID do serviço está em params

    if (!user || !aiServiceId) {
      throw new ForbiddenException('Acesso negado')
    }

    const userWithAccess = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['accessibleAiServices'],
    })

    if (!userWithAccess) {
      throw new ForbiddenException('Usuário não encontrado')
    }

    const hasAccess = userWithAccess.accessibleAiServices.some(
      service => service.id === aiServiceId,
    )

    if (!hasAccess) {
      throw new ForbiddenException('Acesso negado ao serviço de IA')
    }

    return true
  }
}