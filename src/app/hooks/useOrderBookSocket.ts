import { useEffect, useRef } from "react";
import { updateOrderBook, clearOrderBook } from "../store/orderBookSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useOrderBookSocket(){
    const dispatch = useDispatch();
    const { symbol } = useSelector((s: RootState) => s.market);

    const clientRef = useRef<Client | null>(null);
    const subRef = useRef<StompSubscription | null>(null);

    // kết nối ws khi app mount duy nhất
    useEffect(() => {
        const client = new Client({
          webSocketFactory: () => new SockJS("http://localhost:8000/ws"),
          reconnectDelay: 5000,
          debug: (str) => console.log("[STOMP orderbook]", str),
        });
    
        client.onConnect = () => {
          console.log("STOMP orderbook connected");
        };
    
        client.onStompError = (frame) => {
          console.error("Broker error:", frame.headers["message"]);
        };
    
        client.activate();
        clientRef.current = client;
    
        return () => {
          console.log("Disconnect STOMP orderbook");
          client.deactivate();
        };
      }, []);

    useEffect(() => {
        if (!clientRef.current || !clientRef.current.connected) return;

        if (subRef.current) {
            subRef.current.unsubscribe();
        }

        if(symbol){
            const topic = `/topic/spot/orderbook`;
            console.log('Subscribing to',  topic);

            subRef.current = clientRef.current.subscribe(topic, (msg) => {
                console.log(msg)
                const raw = JSON.parse(msg.body);
                // raw = { price, quanlity, type }
                dispatch(updateOrderBook(raw));
            });
        }

        return () => {
            dispatch(clearOrderBook());
        };

    },[symbol, dispatch]);
}