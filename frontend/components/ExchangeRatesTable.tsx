import React, { useEffect, useState } from 'react';
import { currencyApi } from '../utils/api';
import { Chart, Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface Rates {
  [key: string]: number;
}

interface CurrencyNames {
  [code: string]: string;
}

const ExchangeRatesTable = () => {
  const [rates, setRates] = useState<Rates>({});
  const [currencyNames, setCurrencyNames] = useState<CurrencyNames>({});
  const [base, setBase] = useState('USD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [base]);

  const fetchData = async () => {
    setLoading(true);
    const ratesData = await currencyApi.getExchangeRate(base);
    const namesData = await currencyApi.getCurrencies();
    setRates(ratesData);
    setCurrencyNames(namesData);
    setLoading(false);
  };

  return (
    <div className="overflow-x-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Bảng tỉ giá {base} với các đơn vị tiền tệ</h2>
      <div className="mb-4 flex justify-center">
        <select
          className="border rounded px-3 py-2"
          value={base}
          onChange={e => setBase(e.target.value)}
        >
          {Object.entries(currencyNames).map(([code, name]) => (
            <option key={code} value={code}>{code} - {name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Cờ</th>
              <th className="px-4 py-2 border-b">Mã</th>
              <th className="px-4 py-2 border-b">Tên</th>
              <th className="px-4 py-2 border-b">Tỉ giá</th>
              <th className="px-4 py-2 border-b">Biểu đồ</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rates).map(([code, rate]) => (
              <tr key={code}>
                <td className="px-4 py-2 text-center">
                  <span className={`fi fi-${code.slice(0,2).toLowerCase()}`}></span>
                </td>
                <td className="px-4 py-2 font-bold">{code}</td>
                <td className="px-4 py-2">{currencyNames[code]}</td>
                <td className="px-4 py-2">{rate}</td>
                <td className="px-4 py-2 w-32">
                  <MiniChart code={code} base={base} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const MiniChart = ({ code, base }: { code: string, base: string }) => {
  const [historicalData, setHistoricalData] = useState<{ date: string; rate: number; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const response = await currencyApi.getHistoricalRates(startDate, endDate, base, code);
        setHistoricalData(response.rates);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [base, code]);

  if (loading) {
    return <div className="h-16 flex items-center justify-center">Loading...</div>;
  }

  const data = {
    labels: historicalData.map(d => d.date),
    datasets: [
      {
        label: `${base}/${code}`,
        data: historicalData.map(d => d.rate),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `1 ${base} = ${context.parsed.y.toFixed(4)} ${code}`;
          }
        }
      }
    },
    scales: { 
      x: { display: false }, 
      y: { display: false } 
    },
    elements: { 
      line: { borderWidth: 2 } 
    },
  };
  return (
    <div style={{ width: 80, height: 40 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ExchangeRatesTable;
