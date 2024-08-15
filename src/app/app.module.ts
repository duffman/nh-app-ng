import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {WebSocketService} from "./services/websocket.service";
import {ConfigService} from "./services/config.service";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ChatComponent} from "./components/chat/chat.component";

export function initConfig(configService: ConfigService) {
	return () => configService.loadExtConfig().toPromise();
}

@NgModule({
	declarations: [
		AppComponent,
		ChatComponent
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		RouterModule.forChild(routes),
		AppRoutingModule
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy
		},
		ConfigService,
		WebSocketService,
		{
			provide: APP_INITIALIZER,
			useFactory: initConfig,
			deps: [ConfigService],
			multi: true
		}
,
		provideHttpClient(withInterceptorsFromDi()),  // Globally provide HttpClient
		{
			provide: APP_INITIALIZER,
			useFactory: initConfig,
			deps: [ConfigService],
			multi: true
		}

	],
	bootstrap: [AppComponent],
})
export class AppModule {
}
