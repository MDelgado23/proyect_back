import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Prize } from './prize.entity';
import { Roulette } from './roulette.entity'

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => User, user => user.bets)
  user: User;

  @ManyToOne(() => Prize)
  prize: Prize;

  @ManyToOne(() => Roulette)
  @Column()
  rouletteId: number;

  @CreateDateColumn()
  createdAt: Date;


}
