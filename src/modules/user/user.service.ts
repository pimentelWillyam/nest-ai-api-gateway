import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { AiService } from '../ai-services/ai-service.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'

const SALT_ROUNDS = 10

function toUserResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    login: user.login,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { login: createUserDto.login }],
    })

    if (existingUser) {
      const field =
        existingUser.email === createUserDto.email ? 'email' : 'login'
      throw new ConflictException(`The ${field} informed is already in use`)
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_ROUNDS,
    )

    const user = this.userRepository.create({
      email: createUserDto.email,
      login: createUserDto.login,
      password: hashedPassword,
    })

    await this.userRepository.save(user)

    return toUserResponse(user)
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    })
    return users.map(toUserResponse)
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return toUserResponse(user)
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailInUse = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      })
      if (emailInUse) {
        throw new ConflictException('The email informed is already in use')
      }
    }

    if (updateUserDto.login && updateUserDto.login !== user.login) {
      const loginInUse = await this.userRepository.findOne({
        where: { login: updateUserDto.login },
      })
      if (loginInUse) {
        throw new ConflictException('The login informed is already in use')
      }
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS)
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email
    }

    if (updateUserDto.login) {
      user.login = updateUserDto.login
    }

    const updatedUser = await this.userRepository.save(user)

    return toUserResponse(updatedUser)
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    await this.userRepository.remove(user)
  }

  async addAccess(userId: string, aiServiceId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['accessibleAiServices'],
    })

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`)
    }

    const aiService = await this.userRepository.manager.findOne(AiService, {
      where: { id: aiServiceId },
    })

    if (!aiService) {
      throw new NotFoundException(`AI Service with id ${aiServiceId} not found`)
    }

    if (user.accessibleAiServices.some(service => service.id === aiServiceId)) {
      throw new ConflictException('User already has access to this service')
    }

    user.accessibleAiServices.push(aiService)
    await this.userRepository.save(user)
  }

  async removeAccess(userId: string, aiServiceId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['accessibleAiServices'],
    })

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`)
    }

    user.accessibleAiServices = user.accessibleAiServices.filter(
      service => service.id !== aiServiceId,
    )

    await this.userRepository.save(user)
  }

  async getAccessibleServices(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['accessibleAiServices'],
    })

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`)
    }

    return user.accessibleAiServices
  }
}
