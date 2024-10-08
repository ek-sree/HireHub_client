import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://hirehubbackend.online';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, { autoConnect: false });

    this.socket.on('connect', () => {
    });

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  joinConversation(chatId: string) {
    this.socket.emit('joinConversation', chatId);
  }

  sendMessage(message: { chatId: string, senderId: string, receiverId: string, content: string, images: string[], video: string, record: string, recordDuration: number }) {
    this.socket.emit('sendMessage', message);
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket.on('newMessage', callback);
  }

  emitUserOnline(userId: string) {
    this.socket.emit('userOnline', userId);
  }

  onUserStatusChanged(callback: (data: { userId: string, isOnline: boolean }) => void) {
    this.socket.on('userStatusChanged', callback);
  }

  joinRoom(userId: string) {
    this.socket.emit('joinRoom', userId);
  }

  emitLikeNotification(data: { userId: string, postId: string, likedBy: string }) {
    if (this.socket.connected) {
      this.socket.emit('likeNotification', data, (response:any) => {
        if (response.success) {
          console.error('Error processing like notification:', response.error);
        }
      });
    } else {
      console.error('Socket not connected. Unable to emit like notification.');
    }
  }

  newNotification(callback: (data: any) => void) {
    this.socket.on('newNotification', callback);
  }

  
}

export default new SocketService();
