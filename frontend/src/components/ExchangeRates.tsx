'use client';

import { useEffect, useState } from 'react';
import { Rate } from '../types/currency';
import { currencyApi } from '../lib/api';

export default function ExchangeRates() {
  const [rates, setRates] = useState<Rate[]>([]);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const data = await currencyApi.getRates();
      setRates(data);
    } catch (error) {
      console.error('Error loading rates:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Current Exchange Rates</h2>
      <div className="space-y-2">
        {rates.map((rate, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
          >
            <span>
              {rate.from} → {rate.to}
            </span>
            <span className="font-semibold">{rate.rate.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
