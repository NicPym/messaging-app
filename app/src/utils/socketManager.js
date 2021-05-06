import { io } from 'socket.io-client';

class SocketManager {
    constructor() {
        this.socket = null;
    }

    connect() {
        this.socket = io('http://localhost:8080', {
            auth: {
                token: "BBDMESSAGING12345"
            }
        });
    }

    sendMessage(message) {
        this.socket?.emit('send message', message);
    }
    
    registerEvent(eventName, callback) {
        this.socket?.on(eventName, callback);
    }
}

export default new SocketManager();