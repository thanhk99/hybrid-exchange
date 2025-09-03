// lib/hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import webSocketService from '../socket/spotSocket';

interface UseWebSocketReturn {
  isConnected: boolean;
  error: string | null;
  lastMessage: any;
}

type UseWebSocketOptions = {
  initDestination?: string;
  initPayload?: any;
};

const useWebSocket = (topic: string, options?: UseWebSocketOptions): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(webSocketService.getConnectionStatus());
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const subscriptionRef = useRef<any>(null);
  const topicRef = useRef(topic);
  const optionsRef = useRef<UseWebSocketOptions | undefined>(options);

  // Sử dụng useCallback để tránh re-render vô hạn
  const handleMessage = useCallback((message: any) => {
    setLastMessage(message);
  }, []);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setError(null);
    
    // SUBSCRIBE SAU KHI ĐÃ KẾT NỐI
    if (topicRef.current) {
      subscriptionRef.current = webSocketService.subscribe(topicRef.current, handleMessage);
    }

    // GỬI LỆNH ĐĂNG KÝ BAN ĐẦU (NẾU CẦN)
    if (optionsRef.current?.initDestination) {
      try {
        webSocketService.send(optionsRef.current.initDestination, optionsRef.current.initPayload ?? {});
        console.log('📤 Sent init subscribe to', optionsRef.current.initDestination, optionsRef.current.initPayload);
      } catch (e) {
        console.warn('⚠️ Failed to send init subscribe:', e);
      }
    }
  }, [handleMessage]);

  const handleError = useCallback((err: Error) => {
    setError(err.message || 'WebSocket error');
    setIsConnected(false);
  }, []);

  useEffect(() => {
    topicRef.current = topic;
    optionsRef.current = options;

    // Đăng ký event listeners
    webSocketService.onConnect(handleConnect);
    webSocketService.onError(handleError);

    // Nếu đã kết nối rồi thì subscribe ngay
    if (webSocketService.getConnectionStatus()) {
      subscriptionRef.current = webSocketService.subscribe(topic, handleMessage);
    } else {
      // Kết nối nếu chưa kết nối
      webSocketService.connect();
    }

    return () => {
      // Hủy subscription
      if (subscriptionRef.current) {
        webSocketService.unsubscribe(topicRef.current);
        subscriptionRef.current = null;
      }
      
      // Remove event listeners (cần thêm method trong service)
      webSocketService.offConnect(handleConnect);
      webSocketService.offError(handleError);
    };
  }, [topic, options, handleConnect, handleError, handleMessage]);

  return { isConnected, error, lastMessage };
};

export default useWebSocket;