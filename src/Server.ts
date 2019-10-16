import { Playlist } from "./Playlist";
import { Store, ScreenType } from "./stores/Store";
import { LogicalScreen } from "./LogicalScreen";
import { Screen } from "./Screen";
import { ScreenGroup } from "./ScreenGroup";

import * as util from "util";

export class Server {
	private store: Store;
	private screens: { [uuid: string]: LogicalScreen } = {};
	private playlists: { [uuid: string]: Playlist } = {};

	constructor(store: Store) {
		this.store = store;
	}

	public async load() {
		const screens = await this.store.loadScreens();
		for (const data of screens) {
			if (data.type === ScreenType.Screen) {
				this.screens[data.uuid] = new Screen(data);
			}
			else {
				this.screens[data.uuid] = new ScreenGroup(data);
			}
			this.screens[data.uuid].start();
		}
;
		console.log(util.inspect(this.screens, {
			colors: true,
			depth: null,
			compact: false,
		}));
	}
}
