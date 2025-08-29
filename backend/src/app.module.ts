import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; // 👈 thêm
import { CurrencyController } from './currency/currency.controller';
import { CurrencyService } from './currency/currency.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // 1 hour cache
      max: 100, // maximum number of items in cache
    }),
    HttpModule, // 👈 thêm để gọi API
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class AppModule {}
