'use client';

import { useState } from 'react';
import Header from '@/src/components/Header';
import CurrencyConverter from '@/src/components/CurrencyConverter';
import HistoricalRates from '@/src/components/HistoricalRates';

export default function TiGiaPage() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('VND');
  const [showChart, setShowChart] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 flex-grow flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tỉ giá & chuyển đổi</h1>
            <p className="text-lg text-gray-600">Chuyển đổi nhanh chóng giữa các loại tiền tệ</p>
          </div>
          <div className="flex justify-center">
            <CurrencyConverter
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              setFromCurrency={setFromCurrency}
              setToCurrency={setToCurrency}
            />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setShowChart(!showChart)}
          >
            {showChart ? 'Ẩn biểu đồ' : 'Theo dõi'}
          </button>
          {showChart && (
            <div className="mt-8">
              <HistoricalRates from={fromCurrency} to={toCurrency} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}


