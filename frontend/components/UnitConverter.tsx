import { useState, useCallback } from 'react';
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
  const [value, setValue] = useState<string>('');
  
  const [fromUnit, setFromUnit] = useState<Unit | ''>('');
  const [toUnit, setToUnit] = useState<Unit | ''>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);

  const unitLabels = {
    length: {
      mm: 'Millimeters (mm)',
      cm: 'Centimeters (cm)',
      m: 'Meters (m)',
      km: 'Kilometers (km)',
      inch: 'Inches (in)',
      feet: 'Feet (ft)',
      yard: 'Yards (yd)',
      mile: 'Miles (mi)'
    },
    weight: {
      mg: 'Milligrams (mg)',
      g: 'Grams (g)',
      kg: 'Kilograms (kg)',
      oz: 'Ounces (oz)',
      lb: 'Pounds (lb)',
      ton: 'Tons'
    },
    temperature: {
      C: 'Celsius (°C)',
      F: 'Fahrenheit (°F)',
      K: 'Kelvin (K)'
    }
  };

  const unitOptions = {
    length: Object.entries(unitLabels.length).map(([value, label]) => ({ value, label })),
    weight: Object.entries(unitLabels.weight).map(([value, label]) => ({ value, label })),
    temperature: Object.entries(unitLabels.temperature).map(([value, label]) => ({ value, label }))
  };

  const handleConvert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('Vui lòng nhập số hợp lệ');
      return;
    }

    if (!fromUnit || !toUnit) {
      setResult('Vui lòng chọn đơn vị chuyển đổi');
      return;
    }

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

    setResult(`${numValue} ${fromUnit} = ${convertedValue.toFixed(2)} ${toUnit}`);
  };

  return (
    <div className="converter">
      <div className="converter-type">
        <select value={unitType} onChange={(e) => setUnitType(e.target.value as UnitType)}>
          <option value="length">Chiều dài</option>
          <option value="weight">Khối lượng</option>
          <option value="temperature">Nhiệt độ</option>
        </select>
      </div>

      <div className="converter-input">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập giá trị"
        />
        
        <select 
          value={fromUnit} 
          onChange={(e) => setFromUnit(e.target.value as Unit | '')}>
          <option value="">Từ đơn vị</option>
          {unitOptions[unitType].map(unit => (
            <option key={unit.value} value={unit.value}>{unit.label}</option>
          ))}
        </select>

        <select 
          value={toUnit} 
          onChange={(e) => setToUnit(e.target.value as Unit | '')}>
          <option value="">Đến đơn vị</option>
          {unitOptions[unitType].map(unit => (
            <option key={unit.value} value={unit.value}>{unit.label}</option>
          ))}
        </select>

        <button onClick={handleConvert}>Chuyển đổi</button>
      </div>

      {result && <div className="result">{result}</div>}
    </div>
  );
};

export default UnitConverter;
