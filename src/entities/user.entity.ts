// src/entities/user.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Roulette } from './roulette.entity';
import { Bet } from './bet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 0 })
  coins: number;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  imageDeleteUrl: string;

  @OneToMany(() => Roulette, (roulette) => roulette.createdBy)
  roulettes: Roulette[];

  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[];
}
