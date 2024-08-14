import { Controller, Get, Post, Patch, Body, Param, Delete, ConflictException } from '@nestjs/common';
import { PrizeService } from './../services/prize.service';
import { Prize } from './../entities/prize.entity';

@Controller('prizes')
export class PrizeController {
  constructor(private readonly prizeService: PrizeService) {}

  @Get()
  findAll(): Promise<Prize[]> {
    return this.prizeService.findAll();
  }

  @Get('deleted')
  findAllDel(): Promise<Prize[]> {
    return this.prizeService.findAllDel();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Prize> {
    return this.prizeService.findOne(+id);
  }

  @Post()
  create(@Body() prize: Prize): Promise<Prize> {
    return this.prizeService.create(prize);
  }

  @Patch('update-name/:id')
  updateName(@Param('id') id: string, @Body('name') name:string): Promise<Prize> {
    return this.prizeService.updatePrizeName(+id, name);
  }

  @Patch('update-value/:id')
  updateValue(@Param('id') id: string, @Body('value') value: number): Promise<Prize> {
    return this.prizeService.updatePrizeValue(+id, value);
  }

  @Patch('update-imgurl/:id')
  updateImgUrl(@Param('id') id: string, @Body('imageUrl') imageUrl:string): Promise<Prize> {
    return this.prizeService.updatePrizeImgUrl(+id, imageUrl);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.prizeService.remove(+id);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
