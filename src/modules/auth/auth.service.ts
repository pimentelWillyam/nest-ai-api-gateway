import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { User } from '../user/user.entity'
import { LoginAuthDto } from './dto/login-auth.dto'
import { UserResponseDto } from '../user/dto/user-response.dto'

interface JwtPayload {
  sub: string
  login: string
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private getJwtSecret(): string {
    return this.configService.get<string>('jwtSecret') ?? 'super-secret'
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  private async validateUser(
    login: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: [{ email: login }, { login }],
      select: ['id', 'email', 'login', 'password', 'createdAt', 'updatedAt'],
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.toUserResponse(user)
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.validateUser(loginDto.login, loginDto.password)
    const payload: JwtPayload = { sub: user.id, login: user.login }

    return {
      accessToken: sign(payload, this.getJwtSecret(), { expiresIn: '2h' }),
      user,
    }
  }
}
