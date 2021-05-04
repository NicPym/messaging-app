import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { SocketService } from './services/socketService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.sendMessage("Hello, World!");
  }
}
