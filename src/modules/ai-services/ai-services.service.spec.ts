import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AiServicesService } from './ai-services.service'
import { AiService } from './ai-service.entity'
import { User } from '../user/user.entity'

describe('AiServicesService', () => {
  let service: AiServicesService
  let aiServiceRepository: Repository<AiService>

  const mockAiServiceRepository = {
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiServicesService,
        {
          provide: getRepositoryToken(AiService),
          useValue: mockAiServiceRepository,
        },
      ],
    }).compile()

    service = module.get<AiServicesService>(AiServicesService)
    aiServiceRepository = module.get<Repository<AiService>>(getRepositoryToken(AiService))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getUsersWithAccess', () => {
    it('should return users with access', async () => {
      const user = { id: '1' } as User
      const aiService = { id: '2', accessibleByUsers: [user] } as AiService

      mockAiServiceRepository.findOne.mockResolvedValue(aiService)

      const result = await service.getUsersWithAccess('2')

      expect(result).toEqual([user])
    })

    it('should throw if ai service not found', async () => {
      mockAiServiceRepository.findOne.mockResolvedValue(null)

      await expect(service.getUsersWithAccess('2')).rejects.toThrow('Serviço de IA com id 2 não encontrado')
    })
  })
})