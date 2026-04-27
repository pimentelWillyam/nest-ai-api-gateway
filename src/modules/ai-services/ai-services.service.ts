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
      throw new ConflictException(`The ${field} informed is already in use`)
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
      throw new NotFoundException(`AI Service with id ${id} not found`)
    }

    return aiService
  }

  async update(id: string, updateAiServiceDto: UpdateAiServiceDto) {
    const aiService = await this.aiServiceRepository.findOne({
      where: { id },
    })

    if (!aiService) {
      throw new NotFoundException(`AI Service with id ${id} not found`)
    }

    if (updateAiServiceDto.slug && updateAiServiceDto.slug !== aiService.slug) {
      const slugTaken = await this.aiServiceRepository.findOne({
        where: { slug: updateAiServiceDto.slug },
      })
      if (slugTaken) {
        throw new ConflictException('The slug informed is already in use')
      }
    }

    if (updateAiServiceDto.url && updateAiServiceDto.url !== aiService.url) {
      const urlTaken = await this.aiServiceRepository.findOne({
        where: { url: updateAiServiceDto.url },
      })
      if (urlTaken) {
        throw new ConflictException('The url informed is already in use')
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
      throw new NotFoundException(`AI Service with id ${id} not found`)
    }

    return this.aiServiceRepository.remove(aiService)
  }

  async getUsersWithAccess(aiServiceId: string) {
    const aiService = await this.aiServiceRepository.findOne({
      where: { id: aiServiceId },
      relations: ['accessibleByUsers'],
    })

    if (!aiService) {
      throw new NotFoundException(`AI Service with id ${aiServiceId} not found`)
    }

    return aiService.accessibleByUsers
  }
}
