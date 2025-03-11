import { toast } from "sonner";

interface SocketMessage {
  type: string;
  payload?: any;
}

class ChessSocketService {
  private socket: WebSocket | null = null;
  private gameId: string | null = null;
  private playerId: string | null = null;
  private messageListeners: ((message: SocketMessage) => void)[] = [];
  private connectionStateListeners: ((connected: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;

  constructor() {
    this.playerId = localStorage.getItem('chessPlayerId') || this.generatePlayerId();
  }

  private generatePlayerId(): string {
    const id = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chessPlayerId', id);
    return id;
  }

  public connect(gameId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }

    this.gameId = gameId;

    // For demo purposes, use a more reliable WebSocket service
    // Echo WebSocket server for testing
    this.socket = new WebSocket("http://localhost:3000");
    
    this.socket.onopen = () => {
      console.log("WebSocket connection established");
      this.notifyConnectionState(true);
      this.reconnectAttempts = 0;
      
      // Join the specific game room
      this.send({
        type: "JOIN_GAME",
        payload: {
          gameId: this.gameId,
          playerId: this.playerId
        }
      });
    };

    this.socket.onmessage = (event) => {
      try {
        // For echo server, we'll simulate responses
        const receivedData = event.data;
        let message: SocketMessage;
        
        try {
          // Try to parse as JSON first
          message = JSON.parse(receivedData) as SocketMessage;
        } catch (e) {
          // If it's not valid JSON, create a simulated response based on what we sent
          const originalMessage = JSON.parse(receivedData);
          
          // Simulate appropriate responses based on the original message type
          if (originalMessage.type === "JOIN_GAME") {
            message = {
              type: "PLAYER_ASSIGNED",
              payload: {
                gameId: this.gameId,
                playerId: this.playerId,
                color: 'w' // Assign the first player as white
              }
            };
          } else if (originalMessage.type === "REQUEST_PLAYER_ASSIGNMENT") {
            message = {
              type: "PLAYER_ASSIGNED",
              payload: {
                gameId: this.gameId,
                playerId: this.playerId,
                color: originalMessage.payload.color
              }
            };
          } else {
            // Default echo response
            message = originalMessage;
          }
        }
        
        console.log("Message received:", message);
        this.notifyMessageListeners(message);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
      this.notifyConnectionState(false);
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Connection error. Trying to reconnect...");
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast.error("Could not reconnect after multiple attempts. Please refresh the page.");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    this.reconnectTimeout = window.setTimeout(() => {
      if (this.gameId) {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect(this.gameId);
      }
    }, delay);
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.messageListeners = [];
    this.connectionStateListeners = [];
    this.gameId = null;
  }

  public send(message: SocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(message);
      this.socket.send(messageStr);
      
      // For demo, simulate responses for certain messages
      if (message.type === "REQUEST_PLAYER_ASSIGNMENT") {
        // Simulate successful color assignment
        setTimeout(() => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.dispatchEvent(new MessageEvent('message', {
              data: JSON.stringify({
                type: "PLAYER_ASSIGNED",
                payload: {
                  gameId: this.gameId,
                  playerId: this.playerId,
                  color: message.payload.color
                }
              })
            }));
          }
        }, 300);
      }
      
    } else {
      console.warn("Cannot send message, socket is not open");
      toast.warning("You appear to be offline. Reconnecting...");
      if (this.gameId) {
        this.connect(this.gameId);
      }
    }
  }

  public addMessageListener(listener: (message: SocketMessage) => void): void {
    this.messageListeners.push(listener);
  }

  public removeMessageListener(listener: (message: SocketMessage) => void): void {
    this.messageListeners = this.messageListeners.filter(l => l !== listener);
  }

  public addConnectionStateListener(listener: (connected: boolean) => void): void {
    this.connectionStateListeners.push(listener);
  }

  public removeConnectionStateListener(listener: (connected: boolean) => void): void {
    this.connectionStateListeners = this.connectionStateListeners.filter(l => l !== listener);
  }

  private notifyMessageListeners(message: SocketMessage): void {
    this.messageListeners.forEach(listener => listener(message));
  }

  private notifyConnectionState(connected: boolean): void {
    this.connectionStateListeners.forEach(listener => listener(connected));
  }

  public getPlayerId(): string {
    return this.playerId || '';
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
export const chessSocketService = new ChessSocketService();

// Public functions for components to use
export const connectToGame = (gameId: string) => chessSocketService.connect(gameId);
export const disconnectFromGame = () => chessSocketService.disconnect();
export const sendMessage = (message: SocketMessage) => chessSocketService.send(message);
export const addMessageListener = (listener: (message: SocketMessage) => void) => 
  chessSocketService.addMessageListener(listener);
export const removeMessageListener = (listener: (message: SocketMessage) => void) => 
  chessSocketService.removeMessageListener(listener);
export const addConnectionStateListener = (listener: (connected: boolean) => void) => 
  chessSocketService.addConnectionStateListener(listener);
export const removeConnectionStateListener = (listener: (connected: boolean) => void) => 
  chessSocketService.removeConnectionStateListener(listener);
export const getPlayerId = () => chessSocketService.getPlayerId();
export const isConnected = () => chessSocketService.isConnected();