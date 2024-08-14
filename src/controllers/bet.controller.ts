import { Controller, Get, Post, Body, Param, Delete, } from '@nestjs/common';
import { BetService } from './../services/bet.service';
import { Bet } from './../entities/bet.entity';
import { CreateBetDto } from './../dtos/create-bet.dto';

@Controller('bets')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Get()
  findAll(): Promise<Bet[]> {
    return this.betService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Bet> {
    return this.betService.findOne(+id);
  }

  @Get('user/:userId')
  async getBetsByUserId(@Param('userId') userId: string): Promise<Bet[]> {
    return this.betService.findBetsByUserId(+userId);
  }

  @Post()
  create(@Body() createBetDto: CreateBetDto): Promise<Bet> {
    return this.betService.create(createBetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.betService.remove(+id);
  }
}
