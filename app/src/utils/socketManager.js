import { io } from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    let url = location.hostname;
    if (location.port.length > 0)
      url += `:${location.port}`;

    this.socket = io(url, {
      auth: {
        token: token,
      },
    });
  }

  sendMessage(message) {
    this.socket?.emit("send message", message);
  }

  registerEvent(eventName, callback) {
    this.socket?.on(eventName, callback);
  }
}

export default new SocketManager();
