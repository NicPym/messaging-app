import { io } from "socket.io-client";
import { getToken } from "./helpers";

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect() {
    let url = location.hostname;
    if (location.port.length > 0)
      url += `:${location.port}`;

    this.socket = io(url, {
      auth: {
        token: getToken(),
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
