import { PlaylistItem, PlaylistItemType } from "../PlaylistItem";

export class WebsiteSlide implements PlaylistItem {
	private name: string;
	private url: string;
	private duration: number;

	constructor(name: string, settings: any) {
		this.name = name;
		this.url = settings.url;
		this.duration = settings.duration;
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

	getSettings(): any {
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
}
