import {Component} from '@angular/core';
import {WebSocketService} from "./services/websocket.service";
import {ConnectionState} from "./core/types/server.types";

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	connectionStatus: ConnectionState = ConnectionState.IDLE;

	constructor(
		private webSocketService: WebSocketService
	) {
	}

	ngOnInit() {
		// Manually connect when the app initializes or at another appropriate time
		this.webSocketService.connect();

		this.webSocketService.getConnectionStatus().subscribe(status => {
			this.connectionStatus = status;
			console.log(`Connection Status: ${status}`);

			switch (status) {
				case ConnectionState.IDLE:
					console.log('Attempting to reconnect...');
					break;
				case ConnectionState.CONNECTING:
					console.log('Attempting to reconnect...');
					break;
				case ConnectionState.CONNECTED:
					console.log('Successfully connected');
					break;
				case ConnectionState.DISCONNECTED:
					console.log('Disconnected from WebSocket');
					break;
				case ConnectionState.ERROR:
					console.error('Connection error occurred');
					break;
			}
		});
	}
}
