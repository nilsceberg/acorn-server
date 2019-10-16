import { PlaylistItemType } from "../PlaylistItem";

export enum ScreenType {
	Screen = 1,
	Group = 2,
}

export interface ScreenData {
	type: ScreenType;
	uuid: string;
	name: string;
	schedule?: string;
	children: string[];
}

export interface PlaylistData {
	name: string;
	uuid: string;
	items: [
		{
			name: string;
			type: PlaylistItemType;
			settings: any;
		}
	]
}

export interface ScheduleData {
	name: string;
	uuid: string;
	playlist: string;
}

export interface Store {
	loadScreens(): Promise<ScreenData[]>;
	loadPlaylists(): Promise<PlaylistData[]>;
	loadSchedules(): Promise<ScheduleData[]>;
}
