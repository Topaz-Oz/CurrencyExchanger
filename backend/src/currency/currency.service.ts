import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios'; // 👈 thêm vào
import { firstValueFrom } from 'rxjs';       // 👈 để convert Observable -> Promise

import axios from 'axios';

import {
  HistoricalRatesResponseDto,
  HistoricalRateDto,
} from './currency.dto';

@Injectable()
export class CurrencyService {
  //logger: any;
  baseUrl: any;
  apiKey: any;
//  httpService: any;
  testApiKey() {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(CurrencyService.name);
  private readonly API_URL: string;
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly HISTORICAL_CACHE_TTL = 86400; // 24 hours
  private readonly API_KEY?: string;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.API_URL =
      this.configService.get<string>('EXCHANGERATE_API_URL') ||
      'https://api.exchangerate.host';
    this.API_KEY = this.configService.get<string>('EXCHANGERATE_API_KEY');
    console.log(
      `CurrencyService initialized. API URL: ${this.API_URL}, API Key loaded: ${
        this.API_KEY ? 'Yes' : 'No'
      }`,
    );
  }

  /** Append API key automatically */
  private withKey(params: Record<string, any>) {
    if (!this.API_KEY) {
      throw new HttpException(
        'Missing EXCHANGERATE_API_KEY in environment variables',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { ...params, access_key: this.API_KEY };
  }

  async getRates(base: string, symbols?: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/live`, {
        params: {
          access_key: this.API_KEY,
          source: base,
          currencies: symbols,
        },
      });

      if (!response.data.success) {
        this.logger.error(
          `API error when fetching rates: ${JSON.stringify(response.data)}`
        );
        throw new Error('Failed to fetch latest rates');
      }

      return response.data.quotes;
    } catch (error) {
      this.logger.error(`Error fetching latest rates: ${error.message}`);
      throw new Error('Failed to fetch latest rates');
    }
  }

  async convertCurrency(
    amount: number,
    from: string,
    to: string,
  ): Promise<number> {
    try {
      console.log(`Converting ${amount} ${from} -> ${to}`);
      const response = await axios.get(`${this.API_URL}/convert`, {
        params: this.withKey({ from, to, amount }),
      });

      console.log(
        'Convert API Response:',
        JSON.stringify(response.data, null, 2),
      );

      if (!response.data || response.data.success === false) {
        throw new Error(response.data?.error?.info || 'API request failed');
      }

      return response.data.result;
    } catch (err: any) {
      console.error(
        'Error converting currency:',
        err.response?.data || err.message,
      );
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
        },
      });

      if (!response.data.success) {
        this.logger.error(
          `API error when fetching currencies: ${JSON.stringify(response.data)}`
        );
        throw new Error('Failed to fetch supported currencies');
      }

      return response.data.currencies as Record<string, string>;
    } catch (error) {
      this.logger.error(`Error fetching currencies: ${error.message}`);
      throw new Error('Failed to fetch supported currencies');
    }
  }




  async getHistoricalRates(
  startDate: string,
  endDate: string,
  base: string,
  target: string,
): Promise<HistoricalRatesResponseDto> {
  const url = `${this.API_URL}/timeframe`;
  const params = {
    start_date: startDate,
    end_date: endDate,
    source: base,
    currencies: target,
    access_key: this.API_KEY,
  };

  const response = await firstValueFrom(
    this.httpService.get(url, { params }),
  );

  this.logger.debug(
    `Historical rates response: ${JSON.stringify(response.data, null, 2)}`,
  );

  const quotes = response.data?.quotes;
  if (!response.data?.success || !quotes) {
    throw new HttpException(
      response.data?.error?.info || 'Failed to fetch historical rates',
      HttpStatus.BAD_REQUEST,
    );
  }

  // 👇 BẠN CẦN KHAI BÁO BIẾN Ở ĐÂY
  const combinedKey = `${base}${target}`; 

  const rates: HistoricalRateDto[] = Object.keys(quotes)
    .sort()
    .map((date) => {
      const dailyRates = quotes[date];
      return {
        date,
        // 👇 ĐỂ SỬ DỤNG NÓ Ở ĐÂY
        rate: dailyRates?.[combinedKey], 
      };
    })
    .filter((r) => r.rate !== undefined);

  return {
    base,
    target,
    rates,
  };
}




}
