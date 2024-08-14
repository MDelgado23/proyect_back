import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { PrizeModule } from './modules/prize.module';
import { BetModule } from './modules/bet.module';
import { AuthModule } from './modules/auth.module';
import { ImageModule } from './modules/image.module';
import { RouletteModule } from './modules/roulette.module'
import { InitService } from './services/init.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1' /*No lo pude hacer andar con localhost*/,
      port: 3306,
      username: 'admin',
      password: '1234',
      database: 'ruletabd',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    BetModule,
    PrizeModule,
    UserModule,
    RouletteModule,
  ],
  providers: [InitService],
})
export class AppModule {}
