import { Test, TestingModule } from '@nestjs/testing'
import { AiServicesController } from './ai-services.controller'
import { AiServicesService } from './ai-services.service'

describe('AiServicesController', () => {
  let controller: AiServicesController
  let service: AiServicesService

  const mockAiServicesService = {
    getUsersWithAccess: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiServicesController],
      providers: [
        {
          provide: AiServicesService,
          useValue: mockAiServicesService,
        },
      ],
    }).compile()

    controller = module.get<AiServicesController>(AiServicesController)
    service = module.get<AiServicesService>(AiServicesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getUsersWithAccess', () => {
    it('should return users with access', async () => {
      const users = [{ id: '1' }]
      mockAiServicesService.getUsersWithAccess.mockResolvedValue(users)

      const result = await controller.getUsersWithAccess('2')

      expect(result).toEqual(users)
      expect(mockAiServicesService.getUsersWithAccess).toHaveBeenCalledWith('2')
    })
  })
})