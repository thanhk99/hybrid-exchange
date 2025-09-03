import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_CONFIG } from '../constants';

// Định nghĩa interface cho WebSocketService
interface WebSocketService {
  connect(): void;
  disconnect(): void;
  subscribe(topic: string, callback: (data: any) => void): any;
  unsubscribe(topic: string): void;
  send(destination: string, message: any): void;
  getConnectionStatus(): boolean;
  onConnect(callback: () => void): void;
  onError(callback: (error: Error) => void): void;
  offConnect(callback: () => void): void;
  offError(callback: (error: Error) => void): void;
}

// Implement class với đầy đủ properties
class WebSocketServiceImpl implements WebSocketService {
  private client: Client | null = null;
  private isConnected: boolean = false;
  private subscriptions: Map<string, any> = new Map();
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;
  private onConnectCallbacks: (() => void)[] = [];
  private onErrorCallbacks: ((error: Error) => void)[] = [];

  constructor() {
    this.initializeClient(); // THÊM DÒNG NÀY
  }

  // THÊM PHƯƠNG THỨC initializeClient
  private initializeClient(): void {
    // Sử dụng SockJS để kết nối đến Spring Boot WebSocket
    const socketFactory = () => {
      return new SockJS(`${API_CONFIG.BASE_URL}/ws`);
    };
    
    this.client = new Client({
      webSocketFactory: socketFactory,
      connectHeaders: (() => {
        try {
          const accessToken = typeof window !== 'undefined' ? localStorage.getItem('a_tk') : null;
          if (accessToken) {
            return { Authorization: `Bearer ${accessToken}` };
          }
        } catch (_) {}
        return {} as any;
      })(),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Gọi tất cả callback đăng ký
        this.onConnectCallbacks.forEach(callback => callback());
      },
      
      onStompError: (error) => {
        this.isConnected = false;
        this.onErrorCallbacks.forEach(callback => callback(new Error(error.toString())));
      },
      
      onWebSocketClose: (event) => {
        this.isConnected = false;
        this.handleReconnect();
      },
      
      onDisconnect: () => {
        this.isConnected = false;
      }
    });
  }

  connect(): void {
    try {
      if (this.client && !this.client.active) {
        this.client.activate();
      }
    } catch (error) {
      this.onErrorCallbacks.forEach(callback => callback(error as Error));
    }
  }

  // Đăng ký callback khi kết nối thành công
  onConnect(callback: () => void): void {
    this.onConnectCallbacks.push(callback);
  }

  // Đăng ký callback khi có lỗi
  onError(callback: (error: Error) => void): void {
    this.onErrorCallbacks.push(callback);
  }

  // Subscribe đến topic
  subscribe(topic: string, callback: (data: any) => void): any {
    if (!this.client || !this.isConnected) {
      return null;
    }

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        
      }
    });

    this.subscriptions.set(topic, subscription);
    return subscription;
  }

  // Unsubscribe từ topic
  unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  // Gửi message đến server
  send(destination: string, message: any): void {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(message)
      });
    } else {
      
    }
  }

  // Xử lý reconnect
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      setTimeout(() => {
        this.connect();
      }, 3000);
    } else {
      this.onErrorCallbacks.forEach(callback => callback(new Error('Unable to reconnect to WebSocket')));
    }
  }

  // Ngắt kết nối
  disconnect(): void {
    if (this.client) {
      // Hủy tất cả subscriptions
      this.subscriptions.forEach((subscription, topic) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      
      // Ngắt kết nối
      this.client.deactivate();
      this.isConnected = false;
    }
  }

  // Kiểm tra trạng thái kết nối
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
  offConnect(callback: () => void): void {
    this.onConnectCallbacks = this.onConnectCallbacks.filter(cb => cb !== callback);
  }
  
  offError(callback: (error: Error) => void): void {
    this.onErrorCallbacks = this.onErrorCallbacks.filter(cb => cb !== callback);
  }
}

// Tạo instance global (singleton)
const webSocketService: WebSocketService = new WebSocketServiceImpl();

export default webSocketService;