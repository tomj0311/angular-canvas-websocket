import { Component } from '@angular/core';

import { WebSocketService } from './services/web-socket.service';
import { DataService } from './services/data-service';

import { MessageData } from './interfaces/chart-def';

@Component({
  selector: 'app-root',
  template: `<h1>Canvas Line Graph</h1><app-canvas></app-canvas>`,
  // <app-canvas></app-canvas>`,
  // templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebSocketService, DataService]
})

export class AppComponent {

  private messageData: MessageData;

  constructor(private dataService: DataService) {

		dataService.messages.subscribe(msg => {			
      console.log("Response from websocket: " + msg);
		});
	}

  private message = {
		author: 'tutorialedge',
		message: 'this is a test message'
	}

  sendMsg() {
		console.log('new message from client to websocket: ', this.message);
		this.dataService.messages.next(this.messageData);
		this.message.message = '';
	}
}
