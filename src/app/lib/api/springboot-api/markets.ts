import axiosInstance  from "../axios";
import { API_CONFIG } from "../../constants";
import { mapIncomingToCandle } from "@/app/store/marketSlice";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function fetchCandles(
  symbol: string = "BTCUSDT",
  interval: string = "1m",
  limit: number = 72
): Promise<Candle[]> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KLINE.CANDLES}?limit=${limit}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symbol: symbol.toUpperCase(),
      interval: interval,
    })
  });

  if (!res.ok) throw new Error("Failed to fetch candles");

  const json = await res.json();

  const candles = (json.data || [])
    .map((rawCandle: any) => mapIncomingToCandle(rawCandle, symbol, interval))
    .filter((candle: Candle | null) => candle !== null) as Candle[];

  // sắp xếp thời gian tăng dần
  return candles.sort((a, b) => a.time - b.time);

}

export async function fetchSymbols(): Promise<string[]> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KLINE.SYMBOLS}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch symbols");

  const json = await res.json();
  return json.symbols || [];
}

export async function fetchIntervals(): Promise<string[]> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KLINE.INTERVALS}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch intervals");

  const json = await res.json();
  return json.intervals || [];
}
