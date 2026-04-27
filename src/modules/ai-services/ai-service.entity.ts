import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { User } from '../user/user.entity'

@Entity('ai_services')
export class AiService {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  model!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  slug!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  url!: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  @ManyToMany(() => User, (user) => user.accessibleAiServices)
  @JoinTable({
    name: 'user_ai_services',
    joinColumn: { name: 'aiServiceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  accessibleByUsers!: User[]
}
