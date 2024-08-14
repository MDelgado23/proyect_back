import { Controller, Get, Post, Patch, Body, Param, Delete } from '@nestjs/common';
import { RouletteService } from '../services/roulette.service';
import { CreateRouletteDto, UpdateRouletteDto } from '../dtos/roulette.dto';

@Controller('chests')
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @Get()
  findAll() {
    return this.rouletteService.findAll();
  }

  @Get('deleted')
  findAllDel() {
    return this.rouletteService.findAllDel();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rouletteService.findOne(+id);
  }

  @Post()
  create(@Body() createRouletteDto: CreateRouletteDto) {
    return this.rouletteService.createChest(createRouletteDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouletteDto: UpdateRouletteDto) {
    return this.rouletteService.updateChest(+id, updateRouletteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rouletteService.deleteChest(+id);
  }
}
