'use client';

import { useState, useEffect, useCallback } from 'react';
import { currencyApi } from '../lib/api';
import { ChevronDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Currency {
  code: string;
  name: string;
}

interface ConversionResult {
  result: number;
  from: string;
  to: string;
  amount: number;
}

interface CurrencyConverterProps {
  fromCurrency: string;
  toCurrency: string;
  setFromCurrency: (currency: string) => void;
  setToCurrency: (currency: string) => void;
}

export default function CurrencyConverter({
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
}: CurrencyConverterProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState<string>('100');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'VND'];

  useEffect(() => {
    loadCurrencies();
  }, []);

  const handleConvert = useCallback(async () => {
    if (!amount || Number(amount) <= 0 || !fromCurrency || !toCurrency) return;
    
    setIsLoading(true);
    try {
      const data = await currencyApi.convert(fromCurrency, toCurrency, Number(amount));
      setResult(data);
    } catch (error) {
      console.error('Error converting currency:', error);
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleConvert();
    }, 500); // Debounce conversion
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, handleConvert]);

  const loadCurrencies = async () => {
    try {
      const data = await currencyApi.getCurrencies();
      const currencyList = Object.entries(data).map(([code, name]) => ({
        code,
        name: typeof name === 'string' ? name : code
      }));
      setCurrencies(currencyList);
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  };

  // Duplicate handleConvert function removed

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getCurrencyFlag = (code: string) => {
    const flagMap: { [key: string]: string } = {
      USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', VND: '🇻🇳', JPY: '🇯🇵',
      AUD: '🇦🇺', CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳', INR: '🇮🇳',
      AED: '🇦🇪', BGN: '🇧🇬', BRL: '🇧🇷', CZK: '🇨🇿', DKK: '🇩🇰',
      HKD: '🇭🇰', HRK: '🇭🇷', HUF: '🇭🇺', IDR: '🇮🇩', ILS: '🇮🇱',
      KRW: '🇰🇷', MXN: '🇲🇽', MYR: '🇲🇾', NOK: '🇳🇴', NZD: '🇳🇿',
      PHP: '🇵🇭', PLN: '🇵🇱', RON: '🇷🇴', RUB: '🇷🇺', SEK: '��🇪',
      SGD: '🇸🇬', THB: '🇹🇭', TRY: '🇹🇷', ZAR: '🇿🇦'
    };
    return flagMap[code] || '🏳️';
  };

  const filteredFromCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchFrom.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchFrom.toLowerCase())
  );

  const filteredToCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTo.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTo.toLowerCase())
  );

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Chuyển đổi tiền tệ</h2>
        <p className="text-green-100">Chuyển đổi giữa hơn 170 loại tiền tệ</p>
      </div>

      <div className="p-8 space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Số tiền</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            className="w-full text-4xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-green-500 pb-2 outline-none bg-transparent"
            placeholder="0"
          />
        </div>

        {/* Currency Selection */}
        <div className="space-y-4">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Từ</label>
            <div className="relative">
              <button
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{getCurrencyFlag(fromCurrency)}</span>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{fromCurrency}</div>
                    <div className="text-sm text-gray-600">
                      {currencies.find(c => c.code === fromCurrency)?.name || fromCurrency}
                    </div>
                  </div>
                </div>
                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
              </button>

              {isFromDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b">
                    <input
                      type="text"
                      placeholder="Tìm kiếm tiền tệ..."
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="p-3">
                    <div className="text-sm font-bold text-gray-800 mb-2">Phổ biến</div>
                    {popularCurrencies.map(code => {
                      const currency = currencies.find(c => c.code === code);
                      if (!currency) return null;
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            setFromCurrency(code);
                            setIsFromDropdownOpen(false);
                            setSearchFrom('');
                          }}
                          className="flex items-center space-x-3 w-full p-2 hover:bg-green-50 rounded-md"
                        >
                          <span className="text-xl">{getCurrencyFlag(code)}</span>
                          <span className="flex-1 text-left font-medium text-gray-800">{code} - {currency.name}</span>
                          {fromCurrency === code && <span className="text-green-600 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t">
                    <div className="text-sm font-bold text-gray-800 mb-2">Tất cả</div>
                    {filteredFromCurrencies.map(currency => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setFromCurrency(currency.code);
                          setIsFromDropdownOpen(false);
                          setSearchFrom('');
                        }}
                        className="flex items-center space-x-3 w-full p-2 hover:bg-green-50 rounded-md"
                      >
                        <span className="text-xl">{getCurrencyFlag(currency.code)}</span>
                        <span className="flex-1 text-left font-medium text-gray-800">{currency.code} - {currency.name}</span>
                        {fromCurrency === currency.code && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-2 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-transform duration-300 hover:rotate-180"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Đến</label>
            <div className="relative">
              <button
                onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{getCurrencyFlag(toCurrency)}</span>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{toCurrency}</div>
                    <div className="text-sm text-gray-600">
                      {currencies.find(c => c.code === toCurrency)?.name || toCurrency}
                    </div>
                  </div>
                </div>
                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
              </button>

              {isToDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b">
                    <input
                      type="text"
                      placeholder="Tìm kiếm tiền tệ..."
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="p-3">
                    <div className="text-sm font-bold text-gray-800 mb-2">Phổ biến</div>
                    {popularCurrencies.map(code => {
                      const currency = currencies.find(c => c.code === code);
                      if (!currency) return null;
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            setToCurrency(code);
                            setIsToDropdownOpen(false);
                            setSearchTo('');
                          }}
                          className="flex items-center space-x-3 w-full p-2 hover:bg-green-50 rounded-md"
                        >
                          <span className="text-xl">{getCurrencyFlag(code)}</span>
                          <span className="flex-1 text-left font-medium text-gray-800">{code} - {currency.name}</span>
                          {toCurrency === code && <span className="text-green-600 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t">
                    <div className="text-sm font-bold text-gray-800 mb-2">Tất cả</div>
                    {filteredToCurrencies.map(currency => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setToCurrency(currency.code);
                          setIsToDropdownOpen(false);
                          setSearchTo('');
                        }}
                        className="flex items-center space-x-3 w-full p-2 hover:bg-green-50 rounded-md"
                      >
                        <span className="text-xl">{getCurrencyFlag(currency.code)}</span>
                        <span className="flex-1 text-left font-medium text-gray-800">{currency.code} - {currency.name}</span>
                        {toCurrency === currency.code && <span className="text-green-600 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-green-50 rounded-lg p-6 mt-6">
            <div className="text-center">
              <p className="text-lg text-gray-600">{formatNumber(result.amount)} {result.from} tương đương</p>
              <div className="text-4xl font-bold text-green-600 my-2">
                {formatNumber(result.result)} {result.to}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <div className="text-gray-600 mt-2">Đang chuyển đổi...</div>
          </div>
        )}
      </div>
    </div>
  );
}
