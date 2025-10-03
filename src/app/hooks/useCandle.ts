import { useQuery } from '@tanstack/react-query';
import { fetchCandles, Candle } from '@/app/lib/api/springboot-api/markets';
import { fetchSymbols, fetchIntervals } from '@/app/lib/api/springboot-api/markets';

export function useCandle(symbol : string = 'BTCUSDT', interval : string = '1m', limit : number = 72){
    return useQuery<Candle[], Error>({
    queryKey: ['candles', symbol, interval, limit], // cache key duy nhất
    queryFn: () => fetchCandles(symbol!, interval, limit), // fetch dl
    enabled: !!symbol, // có symbol querry mới chạy
    staleTime: 15_000, // trong 15s nếu component unmount và mount -> lấy cache thay vì gọi api mới
    refetchInterval: 30_000, // mỗi 30s tự refetch lại ,fallback nếu WS chết 
  });
}

export function useSymbols(){
    return useQuery({
        queryKey: ['symbols'],
        queryFn: fetchSymbols,
        staleTime: 60_000
    });
}

export function useIntervals(){
    return useQuery({
        queryKey : ['intervals'],
        queryFn : fetchIntervals,
        staleTime : 60_000
    });
}