import {Component, Inject, OnInit} from '@angular/core';
import {WebSocketService} from "../../services/websocket.service";

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
})

export class ChatComponent implements OnInit {
	messages: string[] = [];

	constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
	}


	ngOnInit() {
		this.webSocketService.onMessage('/topic/messages').subscribe((message: string) => {
			console.log('Received message:', message);
			this.messages.push(message);
		});

		setInterval(() => {
			this.webSocketService.sendMessage('/topic/messages', 'Hello from client!');
		}, 10000);
	}
}
