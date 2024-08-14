import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';
import { CreateUserDto } from './../dtos/create-user.dto';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
  
  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByNombreUsuarioOrEmail(username: string, email: string): Promise<User | undefined> {
    return this.userRepository.createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email })
      .getOne();
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateUsername(id: number, username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.username = username;
    return this.userRepository.save(user);
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== currentPassword) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = newPassword;

    await this.userRepository.save(user);
  }

  async updateEmail(id: number, email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.email = email;
    return this.userRepository.save(user);
  }
  
  async updateRole(id: number, role: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role;
    return this.userRepository.save(user);
  }
  
  async updateCoins(id: number, coins: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.coins = coins;
    return this.userRepository.save(user);
  }

  async uploadProfileImage(userId: number, imageFile: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formData = new FormData();
    formData.append('image', imageFile.buffer.toString('base64'));
    formData.append('key', 'cb6ac391110923d4102a612ec3d30330');  

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(),
    });

    const imageUrl = response.data.data.url;
    const deleteUrl = response.data.data.delete_url;

    user.profileImageUrl = imageUrl;
    user.imageDeleteUrl = deleteUrl;

    await this.userRepository.save(user);

    return user;
  }


  async deleteProfileImage(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.imageDeleteUrl) {
      await axios.get(user.imageDeleteUrl);
    }

    user.profileImageUrl = null;
    user.imageDeleteUrl = null;

    await this.userRepository.save(user);

    return user;
  }
  
}
