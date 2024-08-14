import { Module } from '@nestjs/common';
import { ImagesController } from '../controllers/image.controller';
import { ImageService } from '../services/image.service';

@Module({
  controllers: [ImagesController],
  providers: [ImageService],
})
export class ImageModule {}
