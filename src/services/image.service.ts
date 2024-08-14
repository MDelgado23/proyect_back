import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import axiosInstance from 'src/axios/config';
import * as FormData from 'form-data';

const key: string = 'cb6ac391110923d4102a612ec3d30330';

@Injectable()
export class ImageService {
  constructor(private dataSource: DataSource) {}

  async upload(file: Express.Multer.File, userId: number): Promise<any> {
    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64')); 
    formData.append('key', key);
    formData.append('name', 'nombre');

    try {
      const response = await axiosInstance.post('/upload', formData, {
        headers: formData.getHeaders(),
      });

      const imageUrl = response.data.data.url;
      const imageDeleteUrl = response.data.data.delete_url;
      const displayUrl = response.data.data.display_url;

      
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.update('User', userId, {
          url_image: imageUrl,
          url_image_delete: imageDeleteUrl,
          display_url_image: displayUrl,
        });

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }

      return response.data;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
