import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chama } from './chama.entity';
import { User } from './user.entity';

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chamaId: string;

  @ManyToOne(() => Chama)
  @JoinColumn({ name: 'chamaId' })
  chama: Chama;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  contributionDate: Date;

  @Column({ default: 'completed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}