import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roulette } from '../entities/roulette.entity';
import { RoulettePrize } from '../entities/roulette-prize.entity';
import { CreateRouletteDto, UpdateRouletteDto, RoulettePrizeDto } from '../dtos/roulette.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class RouletteService {
  constructor(
    @InjectRepository(Roulette)
    private readonly rouletteRepository: Repository<Roulette>,
    @InjectRepository(RoulettePrize)
    private readonly roulettePrizeRepository: Repository<RoulettePrize>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.rouletteRepository.find({
      relations: ['prizes', 'prizes.prize', 'createdBy'],
      where: { isDeleted: false },
    });
  }

  findAllDel() {
    return this.rouletteRepository.find({
      relations: ['prizes', 'prizes.prize', 'createdBy'],
      where: { isDeleted: true },
    });
  }

  async findOne(id: number) {
    return this.rouletteRepository.findOne({
      where: { id },
      relations: ['prizes', 'prizes.prize', 'createdBy'],
    });
  }

  async createChest(createRouletteDto: CreateRouletteDto): Promise<Roulette> {
    const { name, description, prizes, cost, createdBy, openChestUrl, closedChestUrl } = createRouletteDto;

    const user = await this.userRepository.findOne({ where: { id: createdBy } });
    if (!user) {
      throw new NotFoundException(`User with id ${createdBy} not found`);
    }

    const roulette = this.rouletteRepository.create({
      name,
      description,
      cost,
      createdBy: user,
      openChestUrl: openChestUrl,  // Asigna la URL de la imagen del cofre abierto
      closedChestUrl: closedChestUrl,  // Asigna la URL de la imagen del cofre cerrado
    });

    const savedRoulette = await this.rouletteRepository.save(roulette);

    await this.saveRoulettePrizes(savedRoulette.id, prizes);

    return this.rouletteRepository.findOne({
      where: { id: savedRoulette.id },
      relations: ['prizes', 'prizes.prize', 'createdBy'],
    });
  }

  async updateChest(id: number, updateRouletteDto: UpdateRouletteDto): Promise<Roulette> {
    const { name, description, prizes, cost, openChestUrl, closedChestUrl } = updateRouletteDto;

    const roulette = await this.rouletteRepository.findOne({ where: { id }, relations: ['prizes'] });
    if (!roulette) {
      throw new NotFoundException(`Chest with id ${id} not found`);
    }

    roulette.name = name;
    roulette.description = description;
    roulette.cost = cost;
    roulette.openChestUrl = openChestUrl;  // Actualiza la URL de la imagen del cofre abierto
    roulette.closedChestUrl = closedChestUrl;  // Actualiza la URL de la imagen del cofre cerrado

    await this.rouletteRepository.save(roulette);

    await this.updateRoulettePrizes(id, prizes);

    return this.rouletteRepository.findOne({
      where: { id },
      relations: ['prizes', 'prizes.prize', 'createdBy'],
    });
  }

  async deleteChest(id: number): Promise<void> {
    const roulette = await this.rouletteRepository.findOne({ where: { id }, relations: ['prizes'] });
    if (!roulette) {
      throw new NotFoundException(`Chest with id ${id} not found`);
    }

    roulette.isDeleted = true;
    await this.rouletteRepository.save(roulette);

    const roulettePrizes = await this.roulettePrizeRepository.find({ where: { roulette: { id: id } } });
    for (const prize of roulettePrizes) {
      prize.isDeleted = true;
      await this.roulettePrizeRepository.save(prize);
    }
  }

  private async saveRoulettePrizes(rouletteId: number, prizes: RoulettePrizeDto[]): Promise<void> {
    for (const prize of prizes) {
      const roulettePrize = this.roulettePrizeRepository.create({
        roulette: { id: rouletteId },
        prize: { id: prize.prizeId },
        probability: prize.probability,
      });
      await this.roulettePrizeRepository.save(roulettePrize);
    }
  }

  private async updateRoulettePrizes(rouletteId: number, prizes: RoulettePrizeDto[]): Promise<void> {
    const existingPrizes = await this.roulettePrizeRepository.find({ where: { roulette: { id: rouletteId } }, relations: ['prize'] });

    for (const existingPrize of existingPrizes) {
      const updatedPrize = prizes.find(p => p.prizeId === existingPrize.prize?.id);
      if (updatedPrize) {
        existingPrize.probability = updatedPrize.probability;
        await this.roulettePrizeRepository.save(existingPrize);
      }
    }

    const newPrizes = prizes.filter(p => !existingPrizes.some(ep => ep.prize?.id === p.prizeId));

    for (const prizeToAdd of newPrizes) {
      const roulettePrize = this.roulettePrizeRepository.create({
        roulette: { id: rouletteId },
        prize: { id: prizeToAdd.prizeId },
        probability: prizeToAdd.probability,
      });
      await this.roulettePrizeRepository.save(roulettePrize);
    }

    const prizesToRemove = existingPrizes.filter(ep => !prizes.some(p => p.prizeId === ep.prize?.id));

    for (const prizeToRemove of prizesToRemove) {
      await this.roulettePrizeRepository.remove(prizeToRemove);
    }
  }
}
