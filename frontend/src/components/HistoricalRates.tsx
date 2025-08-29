'use client';

import { useEffect, useState } from 'react';
import { HistoricalRate, ExchangeRateData } from '../types/currency';
import { currencyApi } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface HistoricalRatesProps {
  from: string;
  to: string;
}

export default function ExchangeRateChart({ from, to }: HistoricalRatesProps) {
  const [exchangeData, setExchangeData] = useState<ExchangeRateData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1 month');
  const [isOpen, setIsOpen] = useState(false);

  const timeframes = ['48 hours', '1 week', '1 month', '6 months', '12 months', '5 years'];

  useEffect(() => {
    loadExchangeData();
  }, []);

  const loadExchangeData = async () => {
    try {
      const data = await currencyApi.getHistoricalRates('USD', 'VND', '2024-07-25', '2024-08-24');
      // Simulate exchange rate data for demo
      const simulatedData: ExchangeRateData = {
        currentRate: 26350,
        guaranteedUntil: 'Monday, 25 August at 07:59',
        lastUpdated: 'a few seconds ago',
        historicalData: generateHistoricalData()
      };
      setExchangeData(simulatedData);
    } catch (error) {
      console.error('Error loading exchange data:', error);
    }
  };

  const generateHistoricalData = (): HistoricalRate[] => {
    const data: HistoricalRate[] = [];
    const startDate = new Date('2024-07-25');
    const endDate = new Date('2024-08-24');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Simulate realistic rate fluctuations
      const baseRate = 26150;
      const variation = Math.sin((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) * 0.1) * 300;
      const rate = baseRate + variation + Math.random() * 100;
      
      data.push({
        from: 'USD',
        to: 'VND',
        rate: Math.round(rate),
        date: d.toISOString().split('T')[0]
      });
    }
    
    return data;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = exchangeData?.historicalData.map(item => ({
    date: formatDate(item.date),
    rate: item.rate,
    fullDate: item.date
  })) || [];

  if (!exchangeData) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <ShoppingBagIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Rate guaranteed (19h)</span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-2">
          1 USD = {formatNumber(exchangeData.currentRate)} VND
        </div>
        
        <div className="text-sm text-gray-600 mb-1">
          You'll get this rate as long as we receive your 1,000 USD by {exchangeData.guaranteedUntil}.
        </div>
        
        <div className="text-sm text-gray-500">
          Updated {exchangeData.lastUpdated}
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="px-6 py-4 border-b">
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="text-sm text-gray-600">{label}</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatNumber(payload[0].value as number)} VND
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#059669" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-4 h-0.5 bg-green-600"></div>
          <span className="text-sm text-gray-600">Mid market rate</span>
        </div>

        {/* Disclaimer */}
        <div className="text-sm text-gray-600 text-center mb-6">
          We use the real, mid-market rate with no sneaky mark-up to hide the fees.{' '}
          <a href="#" className="text-green-600 hover:text-green-700 underline">
            Learn more
          </a>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors">
            Track this exchange rate
          </button>
        </div>
      </div>
    </div>
  );
}
