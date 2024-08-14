import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from '../entities/bet.entity';
import { BetService } from '../services/bet.service';
import { BetController } from '../controllers/bet.controller';
import { User } from '../entities/user.entity';
import { UserModule } from './user.module';
import { RoulettePrize } from '../entities/roulette-prize.entity';
import { Prize } from '../entities/prize.entity';
import { RouletteModule } from './roulette.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet, User, RoulettePrize, Prize]), RouletteModule,
    UserModule,
  ],
  providers: [BetService],
  controllers: [BetController],
})
export class BetModule {}
