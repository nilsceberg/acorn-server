import { Playlist } from "./Playlist";
import { PlaylistItem } from "./PlaylistItem";
import { sleep } from "./util/async";

export class PlaylistPointer {
	public readonly playlist: Playlist;

	private items: PlaylistItem[];
	private index: number;
	private currentItem: PlaylistItem;

	constructor(playlist: Playlist, items: PlaylistItem[]) {
		this.playlist = playlist;
		this.index = 0;
		this.items = items;
	}

	getDebugName(): string {
		return `${this.playlist.getName()}[${this.index}]`;
	}

	async next(): Promise<PlaylistItem> {
		if (this.currentItem) {
			await sleep(this.currentItem.getDuration(this.playlist.getDefaultDuration()) * 1000);
		}

		this.index = this.index % this.items.length;
		this.currentItem = this.items[this.index++];

		return this.currentItem;
	}
}
