import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = io(SOCKET_URL, { autoConnect: false });
        this.socket.on('connect', () => {
            console.log('Socket connected');
        });
        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    connect() {
        if (!this.socket.connected) {
            console.log('Attempting to connect socket');
            this.socket.connect();
        }
    }

    disconnect() {
        console.log('Disconnecting socket');
        this.socket.disconnect();
    }

    joinConversation(chatId: string) {
        console.log('Joining conversation:', chatId);
        this.socket.emit('joinConversation', chatId);
    }

    sendMessage(message: { chatId: string, senderId: string, receiverId: string, content: string, images:string[] }) {
        console.log("Sending message via socket:", message);
        this.socket.emit('sendMessage', message, (error: any) => {
            if (error) {
                console.error("Error sending message:", error);
            } else {
                console.log("Message sent successfully");
            }
        });
    }

    onNewMessage(callback: (message: any) => void) {
        this.socket.on('newMessage', (message) => {
            console.log("New message received:", message);
            callback(message);
        });
    }
}

export default new SocketService();