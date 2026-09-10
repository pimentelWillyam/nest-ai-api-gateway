export class UserResponseDto {
  id!: string
  email!: string
  login!: string
  role!: 'admin' | 'user'
  createdAt!: Date
  updatedAt!: Date
}
