import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        console.error('Error during registration:', error);
        throw new BadRequestException('Registration failed');
      }
    }
  }

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        console.error('Error during login:', error);
        throw new BadRequestException('Login failed');
      }
    }
  }
}
