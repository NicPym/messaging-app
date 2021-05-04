import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080');
  }

  sendMessage(message: string) {
    this.socket.emit('send message', { message: message });
  }

  onNewMessage() {
    return new Observable(observer => {
      this.socket.on('new message', message => {
        observer.next(message);
      });
    });
  }
}
