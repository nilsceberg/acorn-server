import { PlaylistItem, PlaylistItemType } from "../PlaylistItem";

export interface WebsiteSettings {
	url: string;
	duration: number;
}

export class WebsiteSlide implements PlaylistItem {
	private name: string;
	private url: string;
	private duration: number;

	constructor(name: string, settings: WebsiteSettings) {
		this.name = name;
		this.setSettings(settings);
	}

	getType(): PlaylistItemType {
		return PlaylistItemType.Website;
	}

	getName(): string {
		return this.name;
	}

	getDuration(playlistDefault: number): number {
		return this.duration;
	}

	getSettings(): WebsiteSettings {
		return {
			url: this.url,
			duration: this.duration,
		}
	}
	
	getPlayerData(): any {
		return {
			url: this.url,
		};
	}

	setName(name: string) {
		this.name = name;
	}

	setSettings(settings: any) {
		if (settings.url !== undefined && settings.duration !== undefined) {
			this.url = settings.url;
			this.duration = settings.duration;
		}
		else {
			throw "invalid settings for website";
		}
	}
}
