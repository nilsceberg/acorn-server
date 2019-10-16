import { Playlist } from "./Playlist";
import { Store, ScreenType } from "./stores/Store";
import { LogicalScreen } from "./LogicalScreen";
import { Screen } from "./Screen";
import { ScreenGroup } from "./ScreenGroup";

import * as util from "util";
import { ScreenRef } from "./ScreenRef";
import { RegistrationManager } from "./RegistrationManager";
import { Schedule } from "./Schedule";
import { PlaylistItemType } from "./PlaylistItem";
import { WebsiteSlide } from "./slides/Website";

export class Server {
	private store: Store;
	private screens: { [uuid: string]: LogicalScreen } = {};
	private playlists: { [uuid: string]: Playlist } = {};
	private schedules: { [uuid: string]: Schedule } = {};

	private registrations: RegistrationManager;
	
	constructor(store: Store) {
		this.store = store;
	}

	public async load() {
		const playlists = await this.store.loadPlaylists();
		for (const data of playlists) {
			const items = [];

			for (const item of data.items) {
				switch (item.type) {
					case PlaylistItemType.Website:
						items.push(new WebsiteSlide(item.name, item.settings));
						break;
					default:
						console.warn("Skipping slide of unknown type " + item.type);
				}
			}

			this.playlists[data.uuid] = new Playlist(data.name, data.uuid, items);
		}

		const schedules = await this.store.loadSchedules();
		for (const data of schedules) {
			const playlist = this.getPlaylist(data.playlist);
			if (!playlist) {
				console.warn("Skipping schedule with missing playlist");
				continue;
			}

			this.schedules[data.uuid] = new Schedule(data.name, data.uuid, playlist);
		}

		const screens = await this.store.loadScreens();
		for (const data of screens) {
			if (data.type === ScreenType.Screen) {
				this.screens[data.uuid] = new Screen(
					data.name,
					new ScreenRef(data.uuid, this.screens),
					data.schedule ? this.getSchedule(data.schedule) : null,
				);
			}
			else {
				this.screens[data.uuid] = new ScreenGroup(
					data.name,
					new ScreenRef(data.uuid, this.screens),
					data.children.map(uuid => new ScreenRef(uuid, this.screens))
				);
			}
		}

		// Initialize screen's parents
		for (const uuid in this.screens) {
			const screen = this.screens[uuid];
			if (screen instanceof ScreenGroup) {
				screen.getChildren().forEach(s => s.setParent(screen))
			}
		}

		console.log(util.inspect(this.screens, {
			colors: true,
			depth: null,
			compact: false,
		}));
		console.log(util.inspect(this.playlists, {
			colors: true,
			depth: null,
			compact: false,
		}));
		console.log(util.inspect(this.schedules, {
			colors: true,
			depth: null,
			compact: false,
		}));

		for (const uuid in this.screens) {
			this.screens[uuid].start();
		}
	}

	public getScreens(): LogicalScreen[] {
		const array: LogicalScreen[] = [];
		for (const uuid in this.screens) {
			array.push(this.screens[uuid]);
		}
		return array;
	}

	public getScreen(uuid: string) {
		return this.screens[uuid];
	}

	public getPlaylist(uuid: string) {
		return this.playlists[uuid];
	}

	public getSchedule(uuid: string) {
		return this.schedules[uuid];
	}
}
