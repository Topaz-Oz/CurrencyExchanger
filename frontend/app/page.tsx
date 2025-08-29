'use client';

import { useState } from 'react';
import Header from '../src/components/Header';
import CurrencyConverter from '../src/components/CurrencyConverter';

export default function Home() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('VND');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Currency Converter
            </h1>
            <p className="text-lg text-gray-600">
              Convert between 170+ currencies with real-time exchange rates
            </p>
          </div>

          <div className="flex justify-center">
            <CurrencyConverter
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              setFromCurrency={setFromCurrency}
              setToCurrency={setToCurrency}
            />
          </div>
        </div>
      </main>
    </>
  );
}
