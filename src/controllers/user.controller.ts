import { Controller, Get, Post, Param, Delete, Body, Patch, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { UserService } from './../services/user.service';
import { CreateUserDto } from './../dtos/create-user.dto';
import { User } from './../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOneById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024000, // 1 MB
          message: 'La imagen no puede superar el 1 MB',
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    console.log('File uploaded:', file);
    return await this.userService.uploadProfileImage(parseInt(id), file);
  }


  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @Delete(':id/delete-profile-image')
  async deleteProfileImage(@Param('id') id: string) {
    return this.userService.deleteProfileImage(+id);
  }

  @Patch('update-username/:id')
  updateUsername(@Param('id') id: string, @Body('username') username: string ): Promise<User> {
    return this.userService.updateUsername(+id, username);
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: number,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    await this.userService.updatePassword(id, currentPassword, newPassword);
  }
  
  @Patch('update-email/:id')
  updateEmail(@Param('id') id: string, @Body('email') email: string): Promise<User> {
    return this.userService.updateEmail(+id, email);
  }

  @Patch('update-role/:id')
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: { role: string }): Promise<User> {
    return this.userService.updateRole(+id, updateRoleDto.role);
  }
  
  @Patch('update-coins/:id')
  updateCoins(@Param('id') id: string, @Body('coins') coins: number): Promise<User> {
    return this.userService.updateCoins(+id, coins);
  }
}

