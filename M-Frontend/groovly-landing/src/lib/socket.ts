import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, TOKEN_KEY } from '@/config/constants';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      console.error('No token found for socket connection');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected');
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
