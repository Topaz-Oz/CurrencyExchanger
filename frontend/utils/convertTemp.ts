export type TempUnit = 'C' | 'F' | 'K';

export const convertTemp = (value: number, from: TempUnit, to: TempUnit): number => {
  // Đầu tiên chuyển đổi sang Celsius
  let celsius: number;
  switch (from) {
    case 'C':
      celsius = value;
      break;
    case 'F':
      celsius = (value - 32) * 5/9;
      break;
    case 'K':
      celsius = value - 273.15;
      break;
    default:
      throw new Error('Đơn vị không hợp lệ');
  }

  // Sau đó chuyển từ Celsius sang đơn vị đích
  switch (to) {
    case 'C':
      return celsius;
    case 'F':
      return (celsius * 9/5) + 32;
    case 'K':
      return celsius + 273.15;
    default:
      throw new Error('Đơn vị không hợp lệ');
  }
};
