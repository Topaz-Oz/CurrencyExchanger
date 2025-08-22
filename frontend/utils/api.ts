import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const currencyApi = {
  getCurrencies: async () => {
    const response = await api.get('/currency/currencies');
    return response.data;
  },

  getExchangeRate: async (base: string) => {
    const response = await api.get(`/currency/rates?base=${base}`);
    return response.data;
  },

  convert: async (amount: number, from: string, to: string) => {
    const response = await api.get('/currency/convert', {
      params: { amount, from, to }
    });
    return response.data;
  }
};

export default api;
