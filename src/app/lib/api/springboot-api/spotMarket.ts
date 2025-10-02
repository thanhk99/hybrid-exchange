import { AppDispatch } from "@/app/store/store";
import { updateTicker } from "@/app/store/spotSlice";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
let subscription: StompSubscription | null = null;

export const connectSpotSocket = (dispatch: AppDispatch) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8000/ws"),
    reconnectDelay: 5000,
    debug: (str) => console.log("[STOMP]", str),

    onConnect: () => {
      console.log("STOMP connected");

      const sub = stompClient?.subscribe("/topic/spot-prices", (msg: IMessage) => {
        if (msg.body) {
          const data = JSON.parse(msg.body);
          const { symbol, price, changePercent, low24h, high24h, volume, timestamp } = data;

          dispatch(
            updateTicker({
              symbol,
              data: { price, changePercent, low24h, high24h, volume, timestamp },
            })
          );
        }
      });

      if (sub) {
        subscription = sub;
      }
    },

    onStompError: (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const closeSpotSocket = () => {
  subscription?.unsubscribe();
  subscription = null;

  if (stompClient?.connected) {
    stompClient.deactivate();
  }
  stompClient = null;
};
