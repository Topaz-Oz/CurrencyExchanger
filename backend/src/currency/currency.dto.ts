import { IsString, IsNumber, IsNotEmpty, IsObject, IsDateString, Validate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Rate Response DTOs
export class ExchangeRatesResponseDto {
  @ApiProperty({ 
    example: true,
    description: 'Success status of the request'
  })
  success: boolean;

  @ApiProperty({ 
    example: {
      EUR: 0.92,
      GBP: 0.79,
      JPY: 146.85,
      VND: 24350
    },
    description: 'Exchange rates for the requested base currency'
  })
  rates: Record<string, number>;

  @ApiProperty({ 
    example: 'USD',
    description: 'Base currency code'
  })
  base: string;

  @ApiProperty({ 
    example: 1692892800,
    description: 'Timestamp of the rates'
  })
  timestamp: number;
}

// Currency List Response DTO
export class CurrencyListResponseDto {
  @ApiProperty({
    example: {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      VND: 'Vietnamese Dong'
    },
    description: 'List of available currencies with their names'
  })
  currencies: Record<string, string>;
}

export class DateRangeValidator {
  validate(startDate: string, args: any) {
    const start = new Date(startDate);
    const endDate = args.object.endDate;
    const end = new Date(endDate);

    // Check if end date is after start date
    if (end < start) {
      return false;
    }

    // Check if date range is within 30 days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }

  defaultMessage() {
    return 'Date range must be valid and not exceed 30 days';
  }
}

export class HistoricalRateQueryDto {
  @IsDateString()
  @Validate(DateRangeValidator)
  @ApiProperty({
    example: '2023-08-01',
    description: 'Start date (YYYY-MM-DD). Must be within last 30 days from end date'
  })
  startDate: string;

  @IsDateString()
  @ApiProperty({
    example: '2023-08-24',
    description: 'End date (YYYY-MM-DD)'
  })
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'USD',
    description: 'Base currency code'
  })
  base: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'EUR',
    description: 'Target currency code'
  })
  target: string;
}

export class HistoricalRateDto {
  @IsDateString()
  @ApiProperty({
    example: '2023-08-01',
    description: 'Rate date'
  })
  date: string;

  @IsNumber()
  @ApiProperty({
    example: 0.91234,
    description: 'Exchange rate value'
  })
  rate: number;
}

export class HistoricalRatesResponseDto {
  @IsString()
  @ApiProperty({
    example: 'USD',
    description: 'Base currency code'
  })
  base: string;

  @IsString()
  @ApiProperty({
    example: 'EUR',
    description: 'Target currency code'
  })
  target: string;

  @Type(() => HistoricalRateDto)
  @ApiProperty({
    type: [HistoricalRateDto],
    description: 'Array of historical rates'
  })
  rates: HistoricalRateDto[];
}

export class ConvertCurrencyDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ 
    example: 100, 
    description: 'Amount to convert' 
  })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    example: 'USD', 
    description: 'Source currency code' 
  })
  from: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    example: 'EUR', 
    description: 'Target currency code' 
  })
  to: string;
}

export class ConvertResponseDto {
  @IsNumber()
  @ApiProperty({ 
    example: 95.23, 
    description: 'Converted amount in target currency' 
  })
  result: number;

  @IsString()
  @ApiProperty({ 
    example: 'USD', 
    description: 'Source currency code' 
  })
  from: string;

  @IsString()
  @ApiProperty({ 
    example: 'EUR', 
    description: 'Target currency code' 
  })
  to: string;

  @IsNumber()
  @ApiProperty({ 
    example: 100, 
    description: 'Original amount' 
  })
  amount: number;
}

export class CurrencyRateResponse {
  @IsBoolean()
  @ApiProperty({ 
    example: true, 
    description: 'Indicates if the request was successful' 
  })
  success: boolean;

  @IsObject()
  @ApiProperty({
    example: {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.23,
      VND: 23000
    },
    description: 'Exchange rates for all supported currencies'
  })
  rates: Record<string, number>;

  @IsNumber()
  @ApiProperty({ 
    example: 1692864000, 
    description: 'Unix timestamp of when rates were last updated' 
  })
  timestamp: number;

  @IsString()
  @ApiProperty({ 
    example: 'USD', 
    description: 'Base currency for the exchange rates' 
  })
  base: string;
}

export class CurrenciesResponseDto {
  @ApiProperty({
    example: ['USD', 'EUR', 'GBP', 'JPY', 'VND'],
    description: 'List of available currency codes',
    type: [String]
  })
  currencies: string[];
}
