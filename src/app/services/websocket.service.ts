import { Injectable } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompConfig } from '@stomp/rx-stomp';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import {ConnectionState} from "../core/types/server.types";

@Injectable({
	providedIn: 'root'
})
export class WebSocketService {
	private _connState: ConnectionState = ConnectionState.DISCONNECTED;
	private _prevConnState: ConnectionState = ConnectionState.DISCONNECTED;
	private connectionStatus$: BehaviorSubject<ConnectionState> = new BehaviorSubject<ConnectionState>(this._connState);

	constructor(private rxStompService: RxStompService, private configService: ConfigService) {}

	get state(): ConnectionState {
		return this._connState;
	}

	set state(newState: ConnectionState) {
		this._prevConnState = this._connState;
		this._connState = newState;
		this.connectionStatus$.next(this._connState);
	}

	/**
	 * Initiate the WebSocket connection manually.
	 */
	connect() {
		this.configureAndConnect();
	}

	private configureAndConnect() {
		const wsConfig: RxStompConfig = {
			brokerURL: this.configService.getConfig('wsEndpoint', 'ws://localhost:8080/ws'),
			reconnectDelay: 5000,
			heartbeatIncoming: 0,
			heartbeatOutgoing: 20000,
			connectHeaders: this.configService.getConfig('wsSettings', {}),
			beforeConnect: () => {
				this.state = ConnectionState.CONNECTING;
			}
		};

		this.rxStompService.configure(wsConfig);
		this.rxStompService.activate();
	}

	getConnectionStatus(): Observable<ConnectionState> {
		return this.connectionStatus$.asObservable();
	}

	sendMessage(topic: string, message: string): void {
		if (this.rxStompService.connected()) {
			this.rxStompService.publish({ destination: topic, body: message });
		}
	}

	onMessage(topic: string): Observable<string> {
		return this.rxStompService.watch(topic).pipe(map(message => message.body));
	}

	updateWebSocketConfig(url: string) {
		this.configService.updateConfig('wsEndpoint', url);
		this.rxStompService.deactivate();
		this.configureAndConnect();
	}

	/**
	 * Manually disconnect the WebSocket.
	 */
	disconnect() {
		this.rxStompService.deactivate();
		this.state = ConnectionState.DISCONNECTED;
	}
}
