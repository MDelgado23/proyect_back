import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from './../entities/bet.entity';
import { CreateBetDto } from './../dtos/create-bet.dto';
import { User } from '../entities/user.entity';
import { RoulettePrize } from '../entities/roulette-prize.entity';
import { Prize } from '../entities/prize.entity';
import { Roulette } from 'src/entities/roulette.entity';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoulettePrize)
    private readonly roulettePrizeRepository: Repository<RoulettePrize>,
    @InjectRepository(Prize)
    private readonly prizeRepository: Repository<Prize>,
    @InjectRepository(Roulette)
    private readonly rouletteRepository: Repository<Roulette>,
  ) {}

  findAll(): Promise<Bet[]> {
    return this.betRepository.find({ relations: ['user', 'prize'], order: { createdAt: 'DESC' as any } });
  }

  findOne(id: number): Promise<Bet> {
    return this.betRepository.findOne({ where: { id }, relations: ['user', 'prize'] });
  }

  async findBetsByUserId(userId: number): Promise<Bet[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return this.betRepository.find({
      where: { user: { id: userId } },
      relations: ['prize', 'user'],
      order: { createdAt: 'DESC' },
    });
  }
  

  async create(createBetDto: CreateBetDto): Promise<Bet> {
    const user = await this.userRepository.findOne({ where: { id: createBetDto.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const roulettePrizes = await this.roulettePrizeRepository.find({
      where: { roulette: { id: createBetDto.rouletteId } },
      relations: ['prize', 'roulette'],
    });
    const prize = this.determinePrize(roulettePrizes);

    if (!prize) {
      throw new Error('Prize could not be determined');
    }

    const bet = this.betRepository.create({
      amount: prize.value,
      user: user,
      prize: prize,
      rouletteId: createBetDto.rouletteId 
    });

    return this.betRepository.save(bet);
}


  async remove(id: number): Promise<void> {
    await this.betRepository.delete(id);
  }

  private determinePrize(roulettePrizes: RoulettePrize[]): Prize | null {
    const totalProbability = roulettePrizes.reduce((sum, rp) => sum + rp.probability, 0);
    const random = Math.floor(Math.random() * totalProbability);

    console.log(`Total Probability: ${totalProbability}`);
    console.log(`Random Number: ${random}`);

    let cumulativeProbability = 0;

    for (const roulettePrize of roulettePrizes) {
      cumulativeProbability += roulettePrize.probability;
      console.log(`Cumulative Probability: ${cumulativeProbability}`);
      console.log(`Current Prize Probability: ${roulettePrize.probability}`);

      if (random < cumulativeProbability) {
        console.log(`Prize Selected: ${roulettePrize.prize.name}`);
        return roulettePrize.prize;
      }
    }

    return null;
  }
}
