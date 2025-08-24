import { useState, useEffect } from 'react';
import { currencyApi } from '../utils/api';
import { formatNumber } from '../utils/formatCurrency';
import Image from 'next/image';
import ExchangeRateChart from './ExchangeRateChart';
import { format, subDays } from 'date-fns';
import CurrencySelector from './CurrencySelector';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

interface HistoricalRate {
  date: string;
  rate: number;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('VND');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  interface CurrencyRate {
    [key: string]: number;
  }

  const [rates, setRates] = useState<CurrencyRate | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (amount) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, amount]);

  useEffect(() => {
    if (amount && exchangeRate) {
      const converted = Number(amount) * exchangeRate;
      setResult(`${formatNumber(Number(amount))} ${fromCurrency} = ${formatNumber(converted)} ${toCurrency}`);
    }
  }, [amount, exchangeRate, fromCurrency, toCurrency]);

  const fetchCurrencies = async () => {
    try {
      const data = await currencyApi.getCurrencies();
      if (typeof data === 'object' && data !== null) {
        const currencyOptions: CurrencyOption[] = Object.entries(data).map(([code, name]) => ({
          code,
          name: String(name),
          flag: `https://wise.com/public-resources/assets/flags/rectangle/${code.toLowerCase()}.png`
        }));
        setCurrencies(currencyOptions);
      } else {
        setCurrencies([]);
      }
    } catch (err) {
      setError('Failed to load currencies');
    }
  };

  const fetchExchangeRate = async () => {
    // Always use amount = 1 for exchange rate preview
    setLoading(true);
    try {
      const data = await currencyApi.convert(1, fromCurrency, toCurrency);
      if (data?.result) {
        setExchangeRate(data.result);
        setError('');
      } else if (data?.message) {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch exchange rate');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ lớn hơn 0');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await currencyApi.convert(numAmount, fromCurrency, toCurrency);
      if (data?.error) {
        setError(data.error);
      } else if (data?.message) {
        setError(data.message);
      } else if (data?.result !== undefined) {
        setResult(`${amount} ${fromCurrency} = ${data.result.toFixed(2)} ${toCurrency}`);
      } else {
        setError('Không nhận được kết quả chuyển đổi');
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi chuyển đổi tiền tệ');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult('');
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Công cụ chuyển đổi đơn vị và tiền tệ</h1>
        <div className="flex justify-center space-x-4 text-sm">
          <button className="text-wise-green-500 font-medium hover:text-wise-green-600 transition-colors">
            Chuyển đổi đơn vị
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-wise-green-500 font-medium hover:text-wise-green-600 transition-colors">
            Chuyển đổi tiền tệ
          </button>
        </div>
      </div>

      {/* Rate Header */}
      {exchangeRate && (
        <div className="bg-gray-50 p-3 rounded-lg text-center mb-6">
          <div className="text-xl font-semibold">
            1 {fromCurrency} = {formatNumber(exchangeRate)} {toCurrency}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Cập nhật vài giây trước
          </div>
        </div>
      )}

      {/* Main Converter Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* From Currency Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            You send exactly
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full text-3xl font-semibold border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              />
            </div>
            <div className="flex-shrink-0">
              <CurrencySelector
                value={fromCurrency}
                onChange={setFromCurrency}
                currencies={currencies}
              />
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-4">
          <button
            onClick={handleSwap}
            className="bg-white p-2 rounded-full shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Currency Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Recipient gets
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-3xl font-semibold text-gray-700 px-4 py-3 bg-gray-50 rounded-lg">
                {exchangeRate && amount ? formatNumber(Number(amount) * exchangeRate) : '0'}
              </div>
            </div>
            <div className="flex-shrink-0">
              <CurrencySelector
                value={toCurrency}
                onChange={setToCurrency}
                currencies={currencies}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
