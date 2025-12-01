
export class StompClient {
    private ws: WebSocket | null = null;
    private subscriptions: Map<string, (message: any) => void> = new Map();
    private url: string;
    private isConnected: boolean = false;
    private pendingSubscriptions: string[] = [];

    constructor(url: string) {
        this.url = url;
    }

    connect(onConnected?: () => void) {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            // Send CONNECT frame
            // STOMP 1.2 requires accept-version and host
            this.ws?.send("CONNECT\naccept-version:1.1,1.0\nhost:localhost\n\n\0");
        };

        this.ws.onmessage = (event) => {
            const rawData = event.data.toString();
            // STOMP servers may send heartbeats (newlines) which we should ignore
            // or they might precede a frame.
            const data = rawData.trimStart();

            if (data.startsWith("CONNECTED")) {
                this.isConnected = true;
                if (onConnected) onConnected();

                // Resubscribe to pending
                this.pendingSubscriptions.forEach(dest => {
                    this.sendSubscribe(dest);
                });
                this.pendingSubscriptions = [];
            } else if (data.startsWith("MESSAGE")) {
                const bodyIndex = data.indexOf("\n\n");
                if (bodyIndex !== -1) {
                    const body = data.substring(bodyIndex + 2).replace(/\0$/, '');
                    const headers = data.substring(0, bodyIndex).split('\n');
                    const destHeader = headers.find((h: string) => h.startsWith('destination:'));

                    if (destHeader) {
                        const destination = destHeader.split(':')[1];
                        const callback = this.subscriptions.get(destination);
                        if (callback) {
                            try {
                                callback(JSON.parse(body));
                            } catch (e) {
                                console.error("Failed to parse message body", e);
                            }
                        }
                    }
                }
            }
        };

        this.ws.onclose = () => {
            this.isConnected = false;
            // Optional: Auto reconnect logic could go here
        };

        this.ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };
    }

    subscribe(destination: string, callback: (message: any) => void) {
        this.subscriptions.set(destination, callback);
        if (this.isConnected) {
            this.sendSubscribe(destination);
        } else {
            this.pendingSubscriptions.push(destination);
        }
    }

    private sendSubscribe(destination: string) {
        const id = "sub-" + Math.floor(Math.random() * 10000);
        this.ws?.send(`SUBSCRIBE\nid:${id}\ndestination:${destination}\n\n\0`);
    }

    disconnect() {
        if (this.ws) {
            // Remove listeners to prevent error logging if closed while connecting
            this.ws.onopen = null;
            this.ws.onclose = null;
            this.ws.onerror = null;
            this.ws.onmessage = null;

            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }
}
