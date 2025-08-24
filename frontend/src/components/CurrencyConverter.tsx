'use client';

import { useState, useEffect } from 'react';
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

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('VND');
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

  useEffect(() => {
    if (amount && fromCurrency && toCurrency && Number(amount) > 0) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency]);

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

  const handleConvert = async () => {
    if (!amount || Number(amount) <= 0) return;
    
    setIsLoading(true);
    try {
      const data = await currencyApi.convert(fromCurrency, toCurrency, Number(amount));
      setResult(data);
    } catch (error) {
      console.error('Error converting currency:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Currency Converter</h2>
        <p className="text-green-100">Convert between 170+ currencies</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            className="w-full text-3xl font-semibold border-none outline-none bg-transparent border-b-2 border-gray-200 focus:border-green-500 pb-2"
            placeholder="0"
          />
        </div>

        {/* Currency Selection */}
        <div className="space-y-4">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">From</label>
            <div className="relative">
              <button
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-400"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCurrencyFlag(fromCurrency)}</span>
                  <div className="text-left">
                    <div className="font-semibold">{fromCurrency}</div>
                    <div className="text-sm text-gray-500">
                      {currencies.find(c => c.code === fromCurrency)?.name || fromCurrency}
                    </div>
                  </div>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </button>

              {isFromDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b">
                    <input
                      type="text"
                      placeholder="Search currency..."
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Popular</div>
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
                          className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-md"
                        >
                          <span className="text-lg">{getCurrencyFlag(code)}</span>
                          <span className="flex-1 text-left">{code} {currency.name}</span>
                          {fromCurrency === code && <span className="text-green-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t">
                    <div className="text-sm font-medium text-gray-700 mb-2">All currencies</div>
                    {filteredFromCurrencies.map(currency => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setFromCurrency(currency.code);
                          setIsFromDropdownOpen(false);
                          setSearchFrom('');
                        }}
                        className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-md"
                      >
                        <span className="text-lg">{getCurrencyFlag(currency.code)}</span>
                        <span className="flex-1 text-left">{currency.code} {currency.name}</span>
                        {fromCurrency === currency.code && <span className="text-green-600">✓</span>}
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
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To</label>
            <div className="relative">
              <button
                onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
                className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-400"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCurrencyFlag(toCurrency)}</span>
                  <div className="text-left">
                    <div className="font-semibold">{toCurrency}</div>
                    <div className="text-sm text-gray-500">
                      {currencies.find(c => c.code === toCurrency)?.name || toCurrency}
                    </div>
                  </div>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </button>

              {isToDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b">
                    <input
                      type="text"
                      placeholder="Search currency..."
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Popular</div>
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
                          className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-md"
                        >
                          <span className="text-lg">{getCurrencyFlag(code)}</span>
                          <span className="flex-1 text-left">{code} {currency.name}</span>
                          {toCurrency === code && <span className="text-green-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t">
                    <div className="text-sm font-medium text-gray-700 mb-2">All currencies</div>
                    {filteredToCurrencies.map(currency => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setToCurrency(currency.code);
                          setIsToDropdownOpen(false);
                          setSearchTo('');
                        }}
                        className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-md"
                      >
                        <span className="text-lg">{getCurrencyFlag(currency.code)}</span>
                        <span className="flex-1 text-left">{currency.code} {currency.name}</span>
                        {toCurrency === currency.code && <span className="text-green-600">✓</span>}
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
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(result.result)} {result.to}
              </div>
              <div className="text-gray-600">
                {formatNumber(result.amount)} {result.from} = {formatNumber(result.result)} {result.to}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <div className="text-gray-600 mt-2">Converting...</div>
          </div>
        )}
      </div>
    </div>
  );
}
