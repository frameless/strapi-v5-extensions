import { create } from 'zustand';

import { PriceTypes } from '../types';

interface PriceStore {
  prices: PriceTypes[] | null;
  status: 'loading' | 'success' | 'error';
  setPrices: (_prices: PriceTypes[]) => void;
  setError: () => void;
}

export const usePriceStore = create<PriceStore>((set) => ({
  prices: null,
  status: 'loading',
  setPrices: (prices) => set({ prices, status: 'success' }),
  setError: () => set({ status: 'error' }),
}));
