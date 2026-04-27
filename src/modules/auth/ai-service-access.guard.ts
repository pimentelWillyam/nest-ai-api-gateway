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
    const user = request.user
    const aiServiceId = request.params.id
    if (!user || !aiServiceId) {
      throw new ForbiddenException('Acess denied')
    }

    const userWithAccess = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['accessibleAiServices'],
    })

    if (!userWithAccess) {
      throw new ForbiddenException('User not found')
    }

    const hasAccess = userWithAccess.accessibleAiServices.some(
      service => service.id === aiServiceId,
    )

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to AI service')
    }

    return true
  }
}