import { Playlist } from "./Playlist";
import { Store } from "./stores/Store";

export class Schedule {
	private name: string;
	private uuid: string;
	private playlist: Playlist;
	private store: Store;

	constructor(name: string, uuid: string, playlist: Playlist, store: Store) {
		this.name = name;
		this.uuid = uuid;
		this.playlist = playlist;
		this.store = store;
	}

	save(): Promise<void> {
		return this.store.saveSchedule({
			name: this.getName(),
			uuid: this.getUuid(),
			playlist: this.playlist ? this.playlist.getUuid() : null,
		});
	}

	getUuid(): string {
		return this.uuid;
	}

	getName(): string {
		return this.name;
	}

	getPlaylist(): Playlist {
		return this.playlist;
	}

	setName(name: string): Promise<void> {
		this.name = name;
		return this.save();
	}

	setPlaylist(playlist: Playlist): Promise<void> {
		this.playlist = playlist;
		return this.save();
	}
}
