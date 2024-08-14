import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from './../entities/user-role.enum';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    const adminUser = await this.userRepository.findOne({ where: { username: 'admin' } });

    if (!adminUser) {
      const newUser = this.userRepository.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'adminpassword', // sin hash
        role: UserRole.ADMIN, 
      });
      await this.userRepository.save(newUser);
      console.log('Usuario admin creado por defecto');
    } else {
      console.log('Usuario admin ya existe');
    }
  }
}
