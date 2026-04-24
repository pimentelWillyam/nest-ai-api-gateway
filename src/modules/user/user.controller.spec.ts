import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController
  let service: UserService

  const mockUserService = {
    addAccess: jest.fn(),
    removeAccess: jest.fn(),
    getAccessibleServices: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('addAccess', () => {
    it('should call addAccess', async () => {
      mockUserService.addAccess.mockResolvedValue(undefined)

      await controller.addAccess('1', '2')

      expect(mockUserService.addAccess).toHaveBeenCalledWith('1', '2')
    })
  })

  describe('removeAccess', () => {
    it('should call removeAccess', async () => {
      mockUserService.removeAccess.mockResolvedValue(undefined)

      await controller.removeAccess('1', '2')

      expect(mockUserService.removeAccess).toHaveBeenCalledWith('1', '2')
    })
  })

  describe('getAccessibleServices', () => {
    it('should return accessible services', async () => {
      const services = [{ id: '2' }]
      mockUserService.getAccessibleServices.mockResolvedValue(services)

      const result = await controller.getAccessibleServices('1')

      expect(result).toEqual(services)
      expect(mockUserService.getAccessibleServices).toHaveBeenCalledWith('1')
    })
  })
})
