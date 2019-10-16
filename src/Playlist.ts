import { PlaylistItem } from "./PlaylistItem";
import { PlaylistPointer } from "./PlaylistPointer";

export class Playlist {
	private defaultDuration: number;
	private items: PlaylistItem[];

	private name: string;
	private uuid: string;

	constructor(name: string, uuid: string, items: PlaylistItem[]) {
		this.defaultDuration = 5;
		this.name = name;
		this.uuid = uuid;
		this.items = items;
	}

	getName(): string {
		return this.name;
	}

	setName(name: string) {
		this.name = name;
	}

	getItems(): PlaylistItem[] {
		return this.items;
	}

	play(): PlaylistPointer {
		return new PlaylistPointer(this, this.items);
	}

	getDefaultDuration(): number {
		return this.defaultDuration;
	}
}
