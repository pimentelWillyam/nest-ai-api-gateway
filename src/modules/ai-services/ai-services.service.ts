import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAiServiceDto } from './dto/create-ai-service.dto'
import { UpdateAiServiceDto } from './dto/update-ai-service.dto'
import { AiService } from './ai-service.entity'

@Injectable()
export class AiServicesService {
  constructor(
    @InjectRepository(AiService)
    private readonly aiServiceRepository: Repository<AiService>,
  ) {}

  async create(createAiServiceDto: CreateAiServiceDto) {
    const existingService = await this.aiServiceRepository.findOne({
      where: [
        { slug: createAiServiceDto.slug },
        { url: createAiServiceDto.url },
      ],
    })

    if (existingService) {
      const field =
        existingService.slug === createAiServiceDto.slug ? 'slug' : 'url'
      throw new ConflictException(`O ${field} informado já está em uso`)
    }

    const aiService = this.aiServiceRepository.create(createAiServiceDto)
    return this.aiServiceRepository.save(aiService)
  }

  async findAll() {
    return this.aiServiceRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string) {
    const aiService = await this.aiServiceRepository.findOne({
      where: { id },
    })

    if (!aiService) {
      throw new NotFoundException(`Serviço de IA com id ${id} não encontrado`)
    }

    return aiService
  }

  async update(id: string, updateAiServiceDto: UpdateAiServiceDto) {
    const aiService = await this.aiServiceRepository.findOne({
      where: { id },
    })

    if (!aiService) {
      throw new NotFoundException(`Serviço de IA com id ${id} não encontrado`)
    }

    if (updateAiServiceDto.slug && updateAiServiceDto.slug !== aiService.slug) {
      const slugTaken = await this.aiServiceRepository.findOne({
        where: { slug: updateAiServiceDto.slug },
      })
      if (slugTaken) {
        throw new ConflictException('O slug informado já está em uso')
      }
    }

    if (updateAiServiceDto.url && updateAiServiceDto.url !== aiService.url) {
      const urlTaken = await this.aiServiceRepository.findOne({
        where: { url: updateAiServiceDto.url },
      })
      if (urlTaken) {
        throw new ConflictException('A url informada já está em uso')
      }
    }

    Object.assign(aiService, updateAiServiceDto)
    return this.aiServiceRepository.save(aiService)
  }

  async remove(id: string) {
    const aiService = await this.aiServiceRepository.findOne({
      where: { id },
    })

    if (!aiService) {
      throw new NotFoundException(`Serviço de IA com id ${id} não encontrado`)
    }

    return this.aiServiceRepository.remove(aiService)
  }

  async getUsersWithAccess(aiServiceId: string) {
    const aiService = await this.aiServiceRepository.findOne({
      where: { id: aiServiceId },
      relations: ['accessibleByUsers'],
    })

    if (!aiService) {
      throw new NotFoundException(`Serviço de IA com id ${aiServiceId} não encontrado`)
    }

    return aiService.accessibleByUsers
  }
}
