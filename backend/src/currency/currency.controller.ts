import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { 
  ConvertResponseDto,
  HistoricalRateQueryDto,
  HistoricalRatesResponseDto,
  ExchangeRatesResponseDto,
  CurrencyListResponseDto
} from './currency.dto';
import axios from 'axios';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test API key', description: 'Test if the API key is working' })
  @ApiResponse({ status: 200, description: 'API key test result' })
  async testApiKey() {
    try {
      // Test direct API call first
      const apiKey = process.env.EXCHANGERATE_API_KEY || 'your_api_key_here';
      console.log('Testing with API key:', apiKey);
      
      const response = await axios.get('https://api.exchangerate.host/convert', {
        params: {
          access_key: apiKey,
          from: 'USD',
          to: 'EUR',
          amount: 1,
          format: 1
        }
      });

      console.log('Direct API Response:', JSON.stringify(response.data, null, 2));

      if (!response.data?.success) {
        return {
          success: false,
          message: 'API key test failed - success is false',
          error: response.data?.error || 'Unknown error',
          response: response.data
        };
      }

      return {
        success: true,
        message: 'API key is working',
        testResult: response.data.result,
        response: response.data
      };
    } catch (error) {
      console.error('Test API Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'API key test failed',
        error: error.response?.data || error.message,
        status: error.response?.status
      };
    }
  }

  @Get('rates')
  @ApiOperation({ summary: 'Get exchange rates', description: 'Get current exchange rates for a base currency' })
  @ApiQuery({ name: 'base', required: false, description: 'Base currency code (e.g. USD, EUR)', example: 'USD' })
  @ApiResponse({ 
    status: 200, 
    description: 'Exchange rates retrieved successfully',
    type: ExchangeRatesResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid base currency' })
  async getRates(@Query('base') base: string = 'USD') {
    return this.currencyService.getRates(base);
  }

  @Get('convert')
  @ApiOperation({ summary: 'Convert currency', description: 'Convert amount from one currency to another' })
  @ApiQuery({ name: 'amount', required: true, description: 'Amount to convert', example: '100' })
  @ApiQuery({ name: 'from', required: true, description: 'Source currency code', example: 'USD' })
  @ApiQuery({ name: 'to', required: true, description: 'Target currency code', example: 'EUR' })
  @ApiResponse({ status: 200, description: 'Currency converted successfully', type: ConvertResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid parameters provided' })
  async convertCurrency(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new HttpException('Amount must be a positive number', HttpStatus.BAD_REQUEST);
    }

    return {
      result: await this.currencyService.convertCurrency(numAmount, from, to),
      from,
      to,
      amount: numAmount
    };
  }

  @Get('currencies')
  @ApiOperation({ summary: 'Get available currencies', description: 'Get list of all available currency codes and their names' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of currency codes and names', 
    type: CurrencyListResponseDto 
  })
  async getSupportedCurrencies() {
    return this.currencyService.getSupportedCurrencies();
  }

  @Get('historical')
  @ApiOperation({ summary: 'Get historical exchange rates', description: 'Get historical exchange rates for a date range (max 30 days)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Historical rates retrieved successfully',
    type: HistoricalRatesResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters or date range exceeds 30 days' })
  async getHistoricalRates(
    @Query() query: HistoricalRateQueryDto
  ): Promise<HistoricalRatesResponseDto> {
    return this.currencyService.getHistoricalRates(
      query.startDate,
      query.endDate,
      query.base,
      query.target
    );
  }
}
