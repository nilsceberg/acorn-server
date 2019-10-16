import { PlaylistItem } from "./PlaylistItem";

export class Playlist {
	private defaultDuration: number;
	private timeoutHandle: NodeJS.Timeout;
	private items: PlaylistItem[];

	constructor() {
		this.defaultDuration = 5;
		this.timeoutHandle = null;
		this.items = [];
	}

	getItems(): PlaylistItem[] {
		return this.items;
	}
}
