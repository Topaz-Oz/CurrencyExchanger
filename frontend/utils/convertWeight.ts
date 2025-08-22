export type WeightUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'ton';

const weightConversions = {
  mg: 1,
  g: 1000,
  kg: 1000000,
  oz: 28349.523125,
  lb: 453592.37,
  ton: 1000000000
};

export const convertWeight = (value: number, from: WeightUnit, to: WeightUnit): number => {
  // Chuyển đổi sang mg (đơn vị cơ sở)
  const valueInMg = value * weightConversions[from];
  
  // Chuyển từ mg sang đơn vị đích
  return valueInMg / weightConversions[to];
};
