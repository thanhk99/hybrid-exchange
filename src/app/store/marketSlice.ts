import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Candle {
  interval?: string;
  symbol?: string;
  time: number; // epoch seconds for lightweight-charts
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// convert dữ liệu candle gửi về từ ws
export function mapIncomingToCandle(
  raw: any,
  symbol: string,
  interval: string
): Candle | null {
  if (!raw) return null;

  const open = Number(raw.open ?? raw.openPrice ?? raw.o);
  const high = Number(raw.high ?? raw.highPrice ?? raw.h);
  const low = Number(raw.low ?? raw.lowPrice ?? raw.l);
  const close = Number(raw.close ?? raw.closePrice ?? raw.c);
  const volume = Number(raw.volume ?? raw.v ?? 0);

  const timeMs = Number(raw.startTime ?? raw.openTime ?? raw.t ?? raw.time);
  if (!Number.isFinite(timeMs)) return null;

  const time = timeMs > 1e11 ? Math.floor(timeMs / 1000) : timeMs;

  if (![open, high, low, close].every(Number.isFinite)) return null;

  return { symbol, interval, time, open, high, low, close, volume };
}

interface Trade {
  time: number;
  price: number;
  qty?: number;
}

interface MarketState {
  symbol: string | null;
  interval: string; // vd 1m
  lastPrice: number | null;
  trades: Trade[];
  candles: Candle[]; // full list (snapshot + realtime upsert)
}

const initialState: MarketState = {
  symbol: "BTCUSDT",
  interval: "1m",
  lastPrice: null,
  trades: [],
  candles: [],
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setSymbol(
      state,
      action: PayloadAction<{ symbol: string; interval?: string }>
    ) {
      state.symbol = action.payload.symbol;
      if (action.payload.interval) state.interval = action.payload.interval;
      state.candles = [];
      state.trades = [];
      state.lastPrice = null;
    },
    // setCandles(state, action: PayloadAction<Candle[]>) {
    //   state.candles = action.payload;
    // },
    // upsertCandle(state, action: PayloadAction<Candle>) {
    //   const c = action.payload;
    //   const idx = state.candles.findIndex(x => x.time === c.time);
    //   if (idx >= 0) state.candles[idx] = { ...state.candles[idx], ...c };
    //   else state.candles.push(c);
    //   if (idx < 0) state.candles.sort((a, b) => a.time - b.time);
    //   if (state.candles.length > 1000) state.candles = state.candles.slice(-1000);
    // },
    upsertCandle(state, action: PayloadAction<Candle>) {
      const c = action.payload;
      const idx = state.candles.findIndex((x) => x.time === c.time);

      if (idx >= 0) {
        // update nến hiện tại (đang chạy)
        state.candles[idx] = { ...state.candles[idx], ...c };
      } else {
        const last = state.candles[state.candles.length - 1];
        if (!last || c.time > last.time) {
          // chỉ push nếu mới hơn last candle
          state.candles.push(c);
          // giữ thứ tự tăng dần
          state.candles.sort((a, b) => a.time - b.time);
        } else {
          // nến cũ hơn thì bỏ qua, không làm gì
          return;
        }
      }
      // giới hạn độ dài mảng
      if (state.candles.length > 1000) {
        state.candles = state.candles.slice(-1000);
      }
    },
    clearMarket(state) {
      state.symbol = null;
      state.candles = [];
      state.trades = [];
      state.lastPrice = null;
    },
  },
});

export const { setSymbol, upsertCandle, clearMarket } =
  marketSlice.actions;
export default marketSlice.reducer;
