import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TickerData = {
  price: number;
  changePercent: number;
  low24h: number;
  high24h: number;
  volume: number;
  timestamp?: number;
};

export interface SpotMarketState {
  [symbol: string]: TickerData;
}

const initialState: SpotMarketState = {};

const spotSlice = createSlice({
  name: "spotmarket",
  initialState,
  reducers: {
    updateTicker: (
      state,
      action: PayloadAction<{ symbol: string; data: TickerData }>
    ) => {
      const { symbol, data } = action.payload;
      state[symbol] = data; // cập nhật theo symbol
    },
  },
});

export const { updateTicker } = spotSlice.actions;
export default spotSlice.reducer;
