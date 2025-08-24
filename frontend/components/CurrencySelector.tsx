import React from 'react';
import Image from 'next/image';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  currencies: CurrencyOption[];
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  currencies,
  className = '',
}) => {
  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full py-2 pl-10 pr-8 bg-white border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
      {selectedCurrency && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-4">
          <Image
            src={selectedCurrency.flag}
            alt={`${selectedCurrency.code} flag`}
            width={24}
            height={16}
            className="rounded"
          />
        </div>
      )}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default CurrencySelector;
