import { IsEmail, IsNotEmpty, IsString, MinLength, IsNumber } from 'class-validator';
import { UserRole } from '../entities/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  role: UserRole = UserRole.USER;

  @IsNotEmpty()
  @IsNumber()
  coins: number;
}
