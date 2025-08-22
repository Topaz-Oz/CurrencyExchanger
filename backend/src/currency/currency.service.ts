import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private readonly API_URL = 'https://api.exchangerate.host';
  private readonly CACHE_TTL = 3600; // 1 hour in seconds

  async getRates(base: string = 'USD'): Promise<any> {
    // Try to get rates from cache first
    const cacheKey = `exchange_rates_${base}`;
    const cachedRates = await this.cacheManager.get(cacheKey);
    if (cachedRates) {
      return cachedRates;
    }

    try {
      const response = await axios.get(`${this.API_URL}/latest`, {
        params: {
          base: base,
          source: 'forex'
        }
      });
      const rates = response.data.rates;
      
      // Cache the rates
      await this.cacheManager.set('exchange_rates', rates, this.CACHE_TTL);
      
      return rates;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch exchange rates',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    try {
      // Get exchange rates with 'from' currency as base
      const rates = await this.getRates(from);
      
      if (!rates[to]) {
        throw new HttpException(
          'Invalid currency code',
          HttpStatus.BAD_REQUEST
        );
      }

      // Direct conversion using the rate
      return amount * rates[to];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Currency conversion failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.API_URL}/symbols`);
      if (response.data.success) {
        // Return sorted list of currency codes
        return Object.keys(response.data.symbols).sort();
      }
      throw new Error('Failed to fetch currency symbols');
    } catch (error) {
      throw new HttpException(
        'Failed to fetch supported currencies',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
