import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prize } from './../entities/prize.entity';
import { RoulettePrize } from './../entities/roulette-prize.entity';

@Injectable()
export class PrizeService {
  constructor(
    @InjectRepository(Prize)
    private readonly prizeRepository: Repository<Prize>,
    @InjectRepository(RoulettePrize)
    private readonly roulettePrizeRepository: Repository<RoulettePrize>,
  ) {}

  findAll(): Promise<Prize[]> {
    return this.prizeRepository.find({
      where: { isDeleted: false},
    });
  }

  findAllDel(): Promise<Prize[]> {
    return this.prizeRepository.find({
      where: { isDeleted: true},
    });
  }

  findOne(id: number): Promise<Prize> {
    return this.prizeRepository.findOne({ where: { id } });
  }

  async create(prize: Prize): Promise<Prize> {
    return this.prizeRepository.save(prize);
  }

  async updatePrizeName(id: number, name:string): Promise<Prize> {
    const prize = await this.prizeRepository.findOne({ where: { id } });
    if (!prize) {
      throw new NotFoundException('Prize not found');
    }
    prize.name = name; 
    return this.prizeRepository.save(prize);
  }

  async updatePrizeValue(id: number, value:number): Promise<Prize> {
    const prize = await this.prizeRepository.findOne({ where: { id } });
    if (!prize) {
      throw new NotFoundException('Prize not found');
    }
    prize.value = value; 
    return this.prizeRepository.save(prize);
  }

  async updatePrizeImgUrl(id: number, imageUrl:string): Promise<Prize> {
    const prize = await this.prizeRepository.findOne({ where: { id } });
    if (!prize) {
      throw new NotFoundException('Prize not found');
    }
    prize.imageUrl = imageUrl; 
    return this.prizeRepository.save(prize);
  }

  async remove(id: number): Promise<void> {
    const relatedRoulettePrizes = await this.roulettePrizeRepository.find({ where: { prize: { id }, isDeleted: false } });
    
      if (relatedRoulettePrizes.length > 0) {
        throw new ConflictException('Cannot delete prize that is part of a roulette that is not deleted.');
      }

    const prize = await this.prizeRepository.findOne({ where: { id } });
    
      if (!prize) {
        throw new NotFoundException('Prize not found');
      } 

    prize.isDeleted = true;
    await this.prizeRepository.save(prize);
  }

}
