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
import { AiService } from '../ai-services/ai-service.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  login!: string

  @Column({ type: 'varchar', select: false })
  password!: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date

  @ManyToMany(() => AiService, { cascade: true })
  @JoinTable({
    name: 'user_ai_services',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'aiServiceId', referencedColumnName: 'id' },
  })
  accessibleAiServices!: AiService[]
}
