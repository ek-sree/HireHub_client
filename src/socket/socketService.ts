import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; 

class SocketService {
  on(arg0: string, handleCallEnded: () => void) {
      throw new Error("Method not implemented.");
  }
  off(arg0: string, handleSignal: (data: { userId: string; type: string; candidate?: RTCIceCandidateInit; answer?: RTCSessionDescriptionInit; }) => Promise<void>) {
      throw new Error("Method not implemented.");
  }
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, { autoConnect: false });
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

  sendMessage(message: { chatId: string, senderId: string, receiverId: string, content: string, images: string[], video:string, record:string,recordDuration:number }) {
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

  signal(userId: string, event: any) {
    this.socket.emit('signal', { userId, type: 'candidate', candidate: event.candidate, context: 'webRTC' }); // Corrected here
  }

  callUser({ userToCall, from, offer, fromId }: { userToCall: string, from: string, offer: RTCSessionDescriptionInit, fromId: string }) {
    this.socket.emit('callUser', { userToCall, from, offer, fromId });
  }

  callAccepted({userId, answer, context: 'webRTC'}){
    this.socket.emit('callAccepted',{userId,answer, context:"webRTC"})
  }

  callEnd(guestId:string){
    this.socket.emit('callEnd',guestId)
  }

}

export default new SocketService();