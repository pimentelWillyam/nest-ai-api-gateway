import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserService } from './user.service'
import { User } from './user.entity'
import { AiService } from '../ai-services/ai-service.entity'

describe('UserService', () => {
  let service: UserService
  let userRepository: Repository<User>

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    manager: {
      findOne: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('addAccess', () => {
    it('should add access to ai service', async () => {
      const user = { id: '1', accessibleAiServices: [] } as User
      const aiService = { id: '2' } as AiService

      mockUserRepository.findOne.mockResolvedValue(user)
      mockUserRepository.manager.findOne.mockResolvedValue(aiService)
      mockUserRepository.save.mockResolvedValue(user)

      await service.addAccess('1', '2')

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['accessibleAiServices'],
      })
      expect(mockUserRepository.save).toHaveBeenCalledWith(user)
      expect(user.accessibleAiServices).toContain(aiService)
    })

    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(service.addAccess('1', '2')).rejects.toThrow('Usuário com id 1 não encontrado')
    })

    it('should throw if ai service not found', async () => {
      const user = { id: '1', accessibleAiServices: [] } as User

      mockUserRepository.findOne.mockResolvedValue(user)
      mockUserRepository.manager.findOne.mockResolvedValue(null)

      await expect(service.addAccess('1', '2')).rejects.toThrow('Serviço de IA com id 2 não encontrado')
    })

    it('should throw if access already exists', async () => {
      const aiService = { id: '2' } as AiService
      const user = { id: '1', accessibleAiServices: [aiService] } as User

      mockUserRepository.findOne.mockResolvedValue(user)

      await expect(service.addAccess('1', '2')).rejects.toThrow('Usuário já tem acesso a este serviço')
    })
  })

  describe('removeAccess', () => {
    it('should remove access to ai service', async () => {
      const aiService = { id: '2' } as AiService
      const user = { id: '1', accessibleAiServices: [aiService] } as User

      mockUserRepository.findOne.mockResolvedValue(user)
      mockUserRepository.save.mockResolvedValue(user)

      await service.removeAccess('1', '2')

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['accessibleAiServices'],
      })
      expect(mockUserRepository.save).toHaveBeenCalledWith(user)
      expect(user.accessibleAiServices).not.toContain(aiService)
    })

    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(service.removeAccess('1', '2')).rejects.toThrow('Usuário com id 1 não encontrado')
    })
  })

  describe('getAccessibleServices', () => {
    it('should return accessible services', async () => {
      const aiService = { id: '2' } as AiService
      const user = { id: '1', accessibleAiServices: [aiService] } as User

      mockUserRepository.findOne.mockResolvedValue(user)

      const result = await service.getAccessibleServices('1')

      expect(result).toEqual([aiService])
    })

    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(service.getAccessibleServices('1')).rejects.toThrow('Usuário com id 1 não encontrado')
    })
  })
})
