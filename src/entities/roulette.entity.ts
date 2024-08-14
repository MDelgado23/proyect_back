import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { RoulettePrize } from './roulette-prize.entity';

@Entity()
export class Roulette {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.roulettes)
  createdBy: User;

  @OneToMany(() => RoulettePrize, (roulettePrize) => roulettePrize.roulette)
  prizes: RoulettePrize[];

  @Column({ nullable: true, default: '' })
  openChestUrl: string;

  @Column({ nullable: true, default: '' })
  closedChestUrl: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'int', default: 0 })
  cost: number; 
}
