import { useState, useEffect } from 'react';
import { currencyApi } from '../utils/api';

interface CurrencyRate {
  success: boolean;
  rates: Record<string, number>;
  timestamp: number;
  base: string;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('VND');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [rates, setRates] = useState<CurrencyRate | null>(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('http://localhost:3001/currency/currencies');
      const data = await response.json();
      setCurrencies(data);
    } catch (err) {
      setError('Failed to load currencies');
    }
  };

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `http://localhost:3001/currency/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(`${amount} ${fromCurrency} = ${data.result.toFixed(2)} ${toCurrency}`);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi chuyển đổi tiền tệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="converter">
      <div className="converter-input">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền"
        />
        
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>

        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>

        <button onClick={handleConvert} disabled={loading}>
          {loading ? 'Đang chuyển đổi...' : 'Chuyển đổi'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {result && <div className="result">{result}</div>}
    </div>
  );
};

export default CurrencyConverter;
