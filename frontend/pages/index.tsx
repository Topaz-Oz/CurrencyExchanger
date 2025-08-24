import { useState } from 'react';
import UnitConverter from '../components/UnitConverter';
import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  const [converterType, setConverterType] = useState<'unit' | 'currency'>('unit');

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', background: '#f5f5f5' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '2rem 0', color: '#2c3e50', textAlign: 'center', letterSpacing: '1px' }}>
        Công cụ chuyển đổi đơn vị và tiền tệ
      </h1>
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
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {converterType === 'unit' ? <UnitConverter /> : <CurrencyConverter />}
      </div>
    </div>
  );
}
