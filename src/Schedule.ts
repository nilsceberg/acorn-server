import { Playlist } from "./Playlist";

export class Schedule {
	private name: string;
	private uuid: string;
	private playlist: Playlist;

	constructor(name: string, uuid: string, playlist: Playlist) {
		this.name = name;
		this.uuid = uuid;
		this.playlist = playlist;
	}

	getPlaylist(): Playlist {
		return this.playlist;
	}
}
