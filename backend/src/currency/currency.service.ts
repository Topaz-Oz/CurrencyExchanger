import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';
import {
  HistoricalRatesResponseDto,
  HistoricalRateDto,
} from './currency.dto';

@Injectable()
export class CurrencyService {
  private readonly API_URL = 'http://api.exchangerate.host';
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly HISTORICAL_CACHE_TTL = 86400; // 24 hours
  private readonly API_KEY: string;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.API_KEY = this.configService.get<string>('EXCHANGERATE_API_KEY');
  }

  async getRates(base = 'USD'): Promise<Record<string, number>> {
    const cacheKey = `exchange_rates_${base}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached as Record<string, number>;

    try {
      const response = await axios.get(`${this.API_URL}/live`, {
        params: {
          access_key: this.API_KEY,
          source: base,
          format: 1
        }
      });

      if (!response.data?.success) {
        throw new Error('API request failed');
      }

      const rates = response.data.rates;
      if (!rates) {
        throw new Error('Invalid response from exchange rate API');
      }

      await this.cacheManager.set(cacheKey, rates, this.CACHE_TTL);
      return rates;
    } catch (err) {
      throw new HttpException(
        'Failed to fetch exchange rates',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async convertCurrency(
    amount: number,
    from: string,
    to: string,
  ): Promise<number> {
    try {
      const response = await axios.get(`${this.API_URL}/convert`, {
        params: {
          access_key: this.API_KEY,
          from,
          to,
          amount,
          format: 1
        },
      });

      if (!response.data?.success) {
        throw new Error('API request failed');
      }

      if (typeof response.data.result !== 'number') {
        throw new Error('Invalid conversion result');
      }

      return response.data.result;
    } catch (err) {
      throw new HttpException(
        'Failed to convert currency',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getSupportedCurrencies(): Promise<Record<string, string>> {
    try {
      const response = await axios.get(`${this.API_URL}/list`, {
        params: {
          access_key: this.API_KEY,
          format: 1
        }
      });
      
      if (!response.data?.success || !response.data?.currencies) {
        throw new Error('Invalid response from currency list API');
      }

      return response.data.currencies;
    } catch (err) {
      throw new HttpException(
        'Failed to fetch supported currencies',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getHistoricalRates(
    startDate: string,
    endDate: string,
    base: string,
    target: string,
  ): Promise<HistoricalRatesResponseDto> {
    const cacheKey = `historical_rates_${base}_${target}_${startDate}_${endDate}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached as HistoricalRatesResponseDto;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dates: string[] = [];

      for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        dates.push(d.toISOString().split('T')[0]);
      }

      const rates: HistoricalRateDto[] = await Promise.all(
        dates.map(async (date) => {
          const response = await axios.get(`${this.API_URL}/${date}`, {
            params: {
              base,
              symbols: target,
            },
          });

          const rate = response.data?.rates?.[target];
          if (!rate) {
            throw new Error(`No rate for ${date}`);
          }

          return {
            date,
            rate,
          };
        }),
      );

      const result: HistoricalRatesResponseDto = {
        base,
        target,
        rates,
      };

      await this.cacheManager.set(cacheKey, result, this.HISTORICAL_CACHE_TTL);
      return result;
    } catch (err) {
      throw new HttpException(
        'Failed to fetch historical rates',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
