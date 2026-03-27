import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAiServiceDto } from './dto/create-ai-service.dto';
import { UpdateAiServiceDto } from './dto/update-ai-service.dto';
import { PrismaService } from '../../infra/database/prisma.service';

@Injectable()
export class AiServicesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createAiServiceDto: CreateAiServiceDto) {
    const existingService = this.prisma.aiService.findFirst({
      where: {
        OR: [
          { slug: createAiServiceDto.slug },
          {url: createAiServiceDto.url },
        ],
      },
    })

    if (existingService) {
      const field = existingService.slug === createAiServiceDto.slug ? 'slug': 'url'
      throw new ConflictException(`O ${field} informado já está em uso`)
    }
  }

  findAll() {
    return `This action returns all aiServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiService`;
  }

  update(id: number, updateAiServiceDto: UpdateAiServiceDto) {
    return `This action updates a #${id} aiService`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiService`;
  }
}
