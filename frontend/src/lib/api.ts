const API_BASE_URL = 'http://localhost:3001/api/currency';

export const currencyApi = {
  getRates: async () => {
    const response = await fetch(`${API_BASE_URL}/rates`);
    return response.json();
  },

  getCurrencies: async () => {
    const response = await fetch(`${API_BASE_URL}/currencies`);
    return response.json();
  },

  convert: async (from: string, to: string, amount: number) => {
    const response = await fetch(
      `${API_BASE_URL}/convert?from=${from}&to=${to}&amount=${amount}`
    );
    return response.json();
  },

  getHistorical: async () => {
    const response = await fetch(`${API_BASE_URL}/historical`);
    return response.json();
  },
};
