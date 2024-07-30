import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

class SocketService {
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

  // Video call methods

  signal(data: 
    | { userId: string, type: 'candidate', candidate: RTCIceCandidate, context: string }
    | { userId: string, type: 'answer', answer: RTCSessionDescriptionInit, context: string }
  ) {
    console.log("Sending signal", data);
    this.socket.emit('signal', data);
  }
  
  callUser({ userToCall, from, offer, fromId }: { userToCall: string, from: string, offer: RTCSessionDescriptionInit, fromId: string }) {
    this.socket.emit('callUser', { userToCall, from, offer, fromId });
  }

  onCallAccepted(data: { userId: string, answer: RTCSessionDescriptionInit, context: string }) {
    console.log("Sending callAccepted signal", data);
    this.socket.emit('callAccepted', data);
  }

  callEnd(guestId: string) {
    this.socket.emit('callEnd', guestId);
  }

  onIncomingCall(callback: (data: { from: string, offer: RTCSessionDescriptionInit, fromId: string }) => void) {
    console.log("Setting up incomingCall listener");
    this.socket.on('incomingCall', (data) => {
      console.log("Received incomingCall event", data);
      callback(data);
    });
  }

  onSignal(callback: (data: { userId: string, type: string, candidate?: RTCIceCandidate, answer?: RTCSessionDescriptionInit }) => void) {
    this.socket.on('signal', callback);
  }


  onCallEnded(callback: () => void) {
    this.socket.on('callEnded', callback);
  }

  removeListener(event: string) {
    this.socket.off(event);
  }

  setUserOnline(userId: string) {
    console.log('Emitting userOnline for:', userId);
    this.socket.emit('userOnline', userId);
  }
}

export default new SocketService();
