import { promises as fs } from "fs";
import { ScreenData, ScreenType, PlaylistData, ScheduleData } from "./Store";
import { PlaylistItemType } from "../PlaylistItem";

export class JsonStore {
	private filename: string;
	private data: {
		screens: { [uuid: string]: {
			name: string,
			parent?: string,
			schedule?: string,
			group?: boolean,
		} };
		playlists: { [uuid: string]: {
			name: string,
			items: [
				{
					name: string,
					type: PlaylistItemType,
					settings: any,
				}
			]
		}},
		schedules: { [uuid: string]: {
			name: string,
			playlist: string,
		}}
	} = {
		screens: {},
		playlists: {},
		schedules: {},
	};

	constructor(filename: string) {
		this.filename = filename;
	}

	public async load() {
		try {
			const file = await fs.open(this.filename, "r");
			this.data = JSON.parse(await file.readFile({
				encoding: "utf-8",
			}));
			await file.close();
		} catch (e) {
			console.warn(e);
			await this.write();
		}
	}

	public async write() {
		try {
			const file = await fs.open(this.filename, "w");
			await file.writeFile(JSON.stringify(this.data, null, 2), {
				encoding: "utf-8"
			});
			await file.close();
		} catch (e) {
			console.error(e);
		}
	}

	public async loadScreens(): Promise<ScreenData[]> {
		const array = [];
		for (const uuid in this.data.screens) {
			const data = this.data.screens[uuid];
			array.push({
				type: data.group ? ScreenType.Group : ScreenType.Screen,
				uuid: uuid,
				name: data.name,
				schedule: data.schedule,
				parent: data.parent,
			});
		}
		return array;
	}

	public async loadPlaylists(): Promise<PlaylistData[]> {
		const array: PlaylistData[] = [];
		for (const uuid in this.data.playlists) {
			const data = this.data.playlists[uuid];
			array.push(
				{
					uuid: uuid,
					name: data.name,
					items: data.items,
				}
			);
		}
		return array;
	}

	public async loadSchedules(): Promise<ScheduleData[]> {
		const array: ScheduleData[] = [];
		for (const uuid in this.data.schedules) {
			const data = this.data.schedules[uuid];
			array.push(
				{
					uuid: uuid,
					name: data.name,
					playlist: data.playlist,
				}
			);
		}
		return array;
	}

	public async saveScreen(data: ScreenData): Promise<void> {
		this.data.screens[data.uuid] = {
			group: data.type === ScreenType.Group,
			name: data.name,
			schedule: data.schedule,
			parent: data.parent,
		};
		await this.write();
	}

	public async savePlaylist(data: PlaylistData): Promise<void> {
		this.data.playlists[data.uuid] = {
			name: data.name,
			items: data.items,
		};
		await this.write();
	}
}
