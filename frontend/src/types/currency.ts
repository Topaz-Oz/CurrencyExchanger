export interface Rate {
  from: string;
  to: string;
  rate: number;
}

export interface Currency {
  code: string;
  name: string;
  flag?: string;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  fee?: number;
  feePercentage?: number;
  savings?: number;
  deliveryTime?: string;
}

export interface HistoricalRate {
  from: string;
  to: string;
  rate: number;
  date: string;
}

export interface ExchangeRateData {
  currentRate: number;
  guaranteedUntil?: string;
  lastUpdated: string;
  historicalData: HistoricalRate[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  fee: number;
  feePercentage: number;
  deliveryTime: string;
}
