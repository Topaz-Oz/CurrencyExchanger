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
import { envConfig } from '../config/env.config';

@Injectable()
export class CurrencyService {
  private readonly API_URL = 'https://api.exchangerate.host';
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly HISTORICAL_CACHE_TTL = 86400; // 24 hours
  private readonly API_KEY: string;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.API_KEY = envConfig.EXCHANGERATE_API_KEY;
    console.log('API Key loaded:', this.API_KEY ? 'Yes' : 'No');
  }

  async getRates(base = 'USD'): Promise<Record<string, number>> {
    const cacheKey = `exchange_rates_${base}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached as Record<string, number>;

    try {
      console.log(`Fetching rates for base: ${base}`);
      const response = await axios.get(`${this.API_URL}/live`, {
        params: {
          access_key: this.API_KEY,
          source: base,
          format: 1
        }
      });

      console.log('API Response:', JSON.stringify(response.data, null, 2));

      if (!response.data?.success) {
        console.error('API request failed - success is false');
        throw new Error('API request failed');
      }

      // Handle different response formats
      let rates: Record<string, number> = {};
      
      if (response.data.quotes) {
        // exchangerate.host format
        Object.keys(response.data.quotes).forEach(key => {
          const currency = key.replace(base, '');
          rates[currency] = response.data.quotes[key];
        });
      } else if (response.data.rates) {
        // Alternative format
        rates = response.data.rates;
      } else {
        console.error('No rates/quotes in response');
        throw new Error('Invalid response from exchange rate API');
      }

      await this.cacheManager.set(cacheKey, rates, this.CACHE_TTL);
      return rates;
    } catch (err) {
      console.error('Error fetching rates:', err.response?.data || err.message);
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
      console.log(`Converting ${amount} ${from} to ${to}`);
      const response = await axios.get(`${this.API_URL}/convert`, {
        params: {
          access_key: this.API_KEY,
          from,
          to,
          amount,
          format: 1
        },
      });

      console.log('Convert API Response:', JSON.stringify(response.data, null, 2));

      if (!response.data?.success) {
        console.error('Convert API request failed - success is false');
        throw new Error('API request failed');
      }

      // Handle different response formats
      let result: number;
      
      if (typeof response.data.result === 'number') {
        result = response.data.result;
      } else if (response.data.info?.quote) {
        // currencylayer format
        result = response.data.info.quote * amount;
      } else {
        console.error('Invalid result format:', response.data);
        throw new Error('Invalid conversion result');
      }

      return result;
    } catch (err) {
      console.error('Error converting currency:', err.response?.data || err.message);
      throw new HttpException(
        'Failed to convert currency',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getSupportedCurrencies(): Promise<Record<string, string>> {
    try {
      console.log('Fetching supported currencies');
      const response = await axios.get(`${this.API_URL}/list`, {
        params: {
          access_key: this.API_KEY,
          format: 1
        }
      });
      
      console.log('Currencies API Response:', JSON.stringify(response.data, null, 2));
      
      if (!response.data?.success) {
        console.error('Invalid currencies response');
        throw new Error('Invalid response from currency list API');
      }

      // Handle different response formats
      let currencies: Record<string, string> = {};
      
      if (response.data.currencies) {
        currencies = response.data.currencies;
      } else if (response.data.symbols) {
        currencies = response.data.symbols;
      } else {
        console.error('No currencies/symbols in response');
        throw new Error('Invalid response from currency list API');
      }

      return currencies;
    } catch (err) {
      console.error('Error fetching currencies:', err.response?.data || err.message);
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
              access_key: this.API_KEY,
              base,
              symbols: target,
            },
          });

          // Handle different response formats
          let rate: number;
          
          if (response.data?.quotes?.[`${base}${target}`]) {
            rate = response.data.quotes[`${base}${target}`];
          } else if (response.data?.rates?.[target]) {
            rate = response.data.rates[target];
          } else {
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
      console.error('Error fetching historical rates:', err.response?.data || err.message);
      throw new HttpException(
        'Failed to fetch historical rates',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
