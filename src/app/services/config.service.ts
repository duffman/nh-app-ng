import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment} from "../environment/environment.dev";

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private runtimeConfig = environment;
	private extConfig: any = {};

	constructor(private http: HttpClient) {}

	/**
	 * Load external configuration from a JSON file.
	 * If the file is missing or there's an error, fallback to defaults.
	 * @returns Observable that resolves when the configuration is loaded.
	 */
	loadExtConfig(): Observable<void> {
		return this.http.get('/assets/config.json').pipe(
			map(config => {
				this.extConfig = config;
			}),
			catchError((error: HttpErrorResponse) => {
				console.error('Could not load config.json, using default settings.', error);
				return of();  // Continue even if the config file is missing
			})
		);
	}

	/**
	 * Get a configuration value by key with an optional default.
	 * @param key - The key of the configuration value.
	 * @param defaultValue - The default value if the key is not found.
	 * @returns The configuration value or the default.
	 */
	getConfig(key: string, defaultValue?: any): any {
		return this.extConfig[key] !== undefined ? this.extConfig[key] : (this.runtimeConfig[key] !== undefined ? this.runtimeConfig[key] : defaultValue);
	}
}
