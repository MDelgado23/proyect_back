import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Prize } from './prize.entity';
import { Roulette } from './roulette.entity';

@Entity()
export class RoulettePrize {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Roulette, (roulette) => roulette.prizes, { onDelete: 'CASCADE' })
  roulette: Roulette;

  @ManyToOne(() => Prize)
  prize: Prize;

  @Column()
  probability: number;

  @Column({ default: false })
  isDeleted: boolean;
}
