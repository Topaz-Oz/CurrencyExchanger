export class ConvertCurrencyDto {
  amount: number;
  from: string;
  to: string;
}

export class CurrencyRateResponse {
  success: boolean;
  rates: Record<string, number>;
  timestamp: number;
  base: string;
}
