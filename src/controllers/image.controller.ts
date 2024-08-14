import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from '../services/image.service';

@Controller('/images')
export class ImagesController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
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
    @Body('userId') userId: number,
  ) {
    if (!file) {
      console.log('No file uploaded');
      throw new Error('No file uploaded');
    }
    console.log('File uploaded:', file);
    return await this.imageService.upload(file, userId);
  }
}
