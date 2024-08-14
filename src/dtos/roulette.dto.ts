import { IsString, IsArray, ValidateNested, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';

export class RoulettePrizeDto {
  @IsNumber()
  prizeId: number;

  @IsNumber()
  probability: number;
}

export class CreateRouletteDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  openChestUrl: string;

  @IsString()
  closedChestUrl: string;

  @IsNumber()
  cost: number; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoulettePrizeDto)
  prizes: RoulettePrizeDto[];

  @IsNumber()
  
  createdBy: number; 
}

export class UpdateRouletteDto extends CreateRouletteDto {
  @IsNumber()
  id: number;
}
