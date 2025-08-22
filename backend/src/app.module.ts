import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CurrencyController } from './currency/currency.controller';
import { CurrencyService } from './currency/currency.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // 1 hour cache
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class AppModule {}
