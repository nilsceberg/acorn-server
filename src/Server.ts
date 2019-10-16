import { Playlist } from "./Playlist";
import { Store, ScreenType } from "./stores/Store";
import { LogicalScreen } from "./LogicalScreen";
import { Screen } from "./Screen";
import { ScreenGroup } from "./ScreenGroup";

import * as util from "util";
import { ScreenRef } from "./ScreenRef";
import { RegistrationManager } from "./RegistrationManager";

export class Server {
	private store: Store;
	private screens: { [uuid: string]: LogicalScreen } = {};
	private playlists: { [uuid: string]: Playlist } = {};

	private registrations: RegistrationManager;
	
	constructor(store: Store) {
		this.store = store;
	}

	public async load() {
		const screens = await this.store.loadScreens();
		for (const data of screens) {
			if (data.type === ScreenType.Screen) {
				this.screens[data.uuid] = new Screen(
					data.name,
					new ScreenRef(data.uuid, this.screens),
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
}
