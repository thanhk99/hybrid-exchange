import { useEffect, useRef } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { upsertCandle, Candle } from "../store/marketSlice";
import { RootState } from "../store/store";
import { mapIncomingToCandle } from "../store/marketSlice";

export function useMarketSocket() {
  const dispatch = useDispatch();
  const { symbol, interval } = useSelector((state: RootState) => state.market);

  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);

  // Kết nối websocket duy nhất khi app mount
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8000/ws"),
      reconnectDelay: 5000,
      // debug: (str) => console.log("[STOMP]", str),
    });

    client.onConnect = () => {
      console.log("STOMP connected");
    };

    client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("Disconnect STOMP");
      client.deactivate();
    };
  }, []);

  // Khi symbol hoặc interval đổi -> unsubscribe cũ + subscribe mới
  useEffect(() => {
    if (!clientRef.current || !clientRef.current.connected) return;
    const client = clientRef.current;

    // Hủy sub cũ nếu có
    if (subRef.current) {
      console.log("Unsubscribing old sub");
      subRef.current.unsubscribe();
    }

    if (symbol && interval) {
      const topic = `/topic/kline-data`;
      console.log("Subscribing to", topic);

      subRef.current = client.subscribe(topic, (message) => {
        // console.log(" Received candle:", message.body); 
        try {
          // const raw = JSON.parse(message.body);
          // const candle = mapIncomingToCandle(raw, symbol, interval);
          // if (candle) {
          //   dispatch(upsertCandle(candle));
          // }

          const raw = JSON.parse(message.body);
          // lọc chỉ xử lý nến của symbol/interval hiện tại
          if (raw.symbol !== symbol || raw.interval !== interval) {
            // console.log(
            //   `Filtered out: ${raw.symbol}/${raw.interval}, current: ${symbol}/${interval}`
            // );
            return; // bỏ qua nến không phải của symbol/interval hiện tại
          }
          const candle = mapIncomingToCandle(raw, symbol, interval);
          if (candle) {
            dispatch(upsertCandle(candle));
          }
        } catch (e) {
          console.error("Parse error:", e, message.body);
        }
      });
    }
  }, [symbol, interval, dispatch]);
}
