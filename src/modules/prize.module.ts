// src/modules/prize.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prize } from '../entities/prize.entity';
import { RoulettePrize } from '../entities/roulette-prize.entity'; 
import { PrizeService } from '../services/prize.service';
import { PrizeController } from '../controllers/prize.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prize, RoulettePrize])], 
  providers: [PrizeService],
  controllers: [PrizeController],
  exports: [TypeOrmModule],
})
export class PrizeModule {}
