import { useState } from 'react';
import UnitConverter from '../components/UnitConverter';
import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  const [converterType, setConverterType] = useState<'unit' | 'currency'>('unit');

  return (
    <div className="container">
      <h1>Công cụ chuyển đổi đơn vị và tiền tệ</h1>
      
      <div className="converter-select">
        <button 
          className={converterType === 'unit' ? 'active' : ''} 
          onClick={() => setConverterType('unit')}
        >
          Chuyển đổi đơn vị
        </button>
        <button 
          className={converterType === 'currency' ? 'active' : ''} 
          onClick={() => setConverterType('currency')}
        >
          Chuyển đổi tiền tệ
        </button>
      </div>

      {converterType === 'unit' ? <UnitConverter /> : <CurrencyConverter />}
    </div>
  );
}
