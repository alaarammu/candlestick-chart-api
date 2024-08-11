import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OrderBookService {
  async fetchOrderBookData() {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/depth?symbol=SOLUSDT');
      console.log('Fetched order book data:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error fetching order book data:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
      } else {
        console.error('General error fetching order book data:', error);
      }
      return { bids: [], asks: [] };
    }
  }
}
