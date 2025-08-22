import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates')
  async getRates(@Query('base') base: string = 'USD') {
    return this.currencyService.getRates(base);
  }

  @Get('convert')
  async convertCurrency(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
    }
    
    return {
      result: await this.currencyService.convertCurrency(numAmount, from, to),
      from,
      to,
      amount: numAmount
    };
  }

  @Get('currencies')
  async getSupportedCurrencies() {
    return this.currencyService.getSupportedCurrencies();
  }
}
