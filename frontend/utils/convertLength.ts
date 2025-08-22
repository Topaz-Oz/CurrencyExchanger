export type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'inch' | 'feet' | 'yard' | 'mile';

const lengthConversions = {
  mm: 1,
  cm: 10,
  m: 1000,
  km: 1000000,
  inch: 25.4,
  feet: 304.8,
  yard: 914.4,
  mile: 1609344
};

export const convertLength = (value: number, from: LengthUnit, to: LengthUnit): number => {
  // Chuyển đổi sang mm (đơn vị cơ sở)
  const valueInMm = value * lengthConversions[from];
  
  // Chuyển từ mm sang đơn vị đích
  return valueInMm / lengthConversions[to];
};
