import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',  // Redirects the root path to 'home'
		pathMatch: 'full'
	},
	{
		path: 'home',
		loadChildren: () => import('./components/home/home.module').then(m => m.HomePageModule)
	},
	{
		path: 'chat',
		loadChildren: () => import('./components/chat/chat.module').then(m => m.ChatModule)
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
