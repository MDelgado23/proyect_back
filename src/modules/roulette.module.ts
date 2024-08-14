import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roulette } from '../entities/roulette.entity';
import { RoulettePrize } from '../entities/roulette-prize.entity';
import { Prize } from '../entities/prize.entity';
import { RouletteService } from '../services/roulette.service';
import { RouletteController } from '../controllers/roulette.controller';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roulette, RoulettePrize, Prize, User])],
  controllers: [RouletteController],
  providers: [RouletteService],
  exports: [TypeOrmModule],
})
export class RouletteModule {}
