import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRole } from '../entities/user-role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // Verifico si el nombre de usuario ya existe
    const existingUserByUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUserByUsername) {
      throw new BadRequestException('Username already exists');
    }

    // Verifico si el email ya existe
    const existingUserByEmail = await this.userRepository.findOne({ where: { email } });
    if (existingUserByEmail) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = this.userRepository.create({
      username,
      email,
      password, 
      role: UserRole.USER, 
    });

    return this.userRepository.save(newUser);
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(body: { username: string; password: string }) {
    const user = await this.validateUser(body.username, body.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      role: user.role,
      id: user.id,
      coins: user.coins,
    };
  }
}
