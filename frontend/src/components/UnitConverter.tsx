'use client';

import { useState, useCallback, useEffect } from 'react';
import { convertLength, LengthUnit } from '../utils/convertLength';
import { convertWeight, WeightUnit } from '../utils/convertWeight';
import { convertTemp, TempUnit } from '../utils/convertTemp';

type UnitType = 'length' | 'weight' | 'temperature';
type Unit = LengthUnit | WeightUnit | TempUnit;

interface UnitOption {
  value: string;
  label: string;
}

const UnitConverter = () => {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit | ''>('m');
  const [toUnit, setToUnit] = useState<Unit | ''>('cm');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const unitLabels: { [key in UnitType]: { [key: string]: string } } = {
    length: {
      mm: 'Millimeters', cm: 'Centimeters', m: 'Meters', km: 'Kilometers',
      in: 'Inches', ft: 'Feet', yd: 'Yards', mi: 'Miles'
    },
    weight: {
      mg: 'Milligrams', g: 'Grams', kg: 'Kilograms', oz: 'Ounces',
      lb: 'Pounds', ton: 'Tons'
    },
    temperature: {
      C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin'
    }
  };

  const unitOptions = {
    length: Object.entries(unitLabels.length).map(([value, label]) => ({ value, label })),
    weight: Object.entries(unitLabels.weight).map(([value, label]) => ({ value, label })),
    temperature: Object.entries(unitLabels.temperature).map(([value, label]) => ({ value, label }))
  };

  const handleConvert = useCallback(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError('Vui lòng nhập một số hợp lệ.');
      setResult('');
      return;
    }

    if (!fromUnit || !toUnit) {
      setError('Vui lòng chọn cả hai đơn vị.');
      setResult('');
      return;
    }

    setError('');
    let convertedValue: number;
    switch (unitType) {
      case 'length':
        convertedValue = convertLength(numValue, fromUnit as LengthUnit, toUnit as LengthUnit);
        break;
      case 'weight':
        convertedValue = convertWeight(numValue, fromUnit as WeightUnit, toUnit as WeightUnit);
        break;
      case 'temperature':
        convertedValue = convertTemp(numValue, fromUnit as TempUnit, toUnit as TempUnit);
        break;
      default:
        return;
    }
    setResult(`${convertedValue.toFixed(2)}`);
  }, [value, fromUnit, toUnit, unitType]);

  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleUnitTypeChange = (type: UnitType) => {
    setUnitType(type);
    // Reset units when type changes
    if (type === 'length') {
      setFromUnit('m');
      setToUnit('cm');
    } else if (type === 'weight') {
      setFromUnit('kg');
      setToUnit('g');
    } else if (type === 'temperature') {
      setFromUnit('C');
      setToUnit('F');
    }
    setValue('1');
    setResult('');
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="mb-6">
        <div className="flex justify-center space-x-2 mb-6">
          <button
            onClick={() => handleUnitTypeChange('length')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              unitType === 'length'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Chiều dài
          </button>
          <button
            onClick={() => handleUnitTypeChange('weight')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              unitType === 'weight'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Khối lượng
          </button>
          <button
            onClick={() => handleUnitTypeChange('temperature')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              unitType === 'temperature'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Nhiệt độ
          </button>
        </div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Giá trị
        </label>
        <div className="relative">
          <input
            id="amount"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-4 text-4xl font-bold text-gray-900 border-2 border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500"
            placeholder="1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
            Từ
          </label>
          <select
            id="from"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:ring-green-500 focus:border-green-500"
          >
            {unitOptions[unitType].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-transform duration-300 hover:rotate-180"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
            Đến
          </label>
          <select
            id="to"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as Unit)}
            className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:ring-green-500 focus:border-green-500"
          >
            {unitOptions[unitType].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {result && !error && (
        <div className="mt-8 text-center bg-green-50 rounded-lg p-6">
          <p className="text-lg text-gray-600">{value} {fromUnit && unitLabels[unitType][fromUnit]} =</p>
          <p className="text-4xl font-bold text-green-600">
            {result} {toUnit && unitLabels[unitType][toUnit]}
          </p>
        </div>
      )}
    </div>
  );
};

export default UnitConverter;