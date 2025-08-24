import axios, { AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ErrorResponse {
  message: string;
  statusCode: number;
}

const handleError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    // Server responded with error status
    throw new Error(error.response.data.message || 'An error occurred with the request');
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('No response received from server');
  } else {
    // Error in request setup
    throw new Error('Error setting up the request');
  }
};

export const currencyApi = {
  getCurrencies: async () => {
    try {
  const response = await api.get('currency/currencies');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
    }
  },

  getExchangeRate: async (base: string) => {
    try {
      const response = await api.get(`/currency/rates?base=${base}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
    }
  },

  convert: async (amount: number, from: string, to: string) => {
    try {
      const response = await api.get('/currency/convert', {
        params: { amount, from, to }
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
    }
  },

  getHistoricalRates: async (startDate: string, endDate: string, base: string, target: string) => {
    try {
      const response = await api.get('/currency/historical', {
        params: {
          startDate,
          endDate,
          base,
          target
        }
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>);
    }
  }
};

export default api;
