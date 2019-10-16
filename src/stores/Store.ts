export enum ScreenType {
	Screen = 1,
	Group = 2,
}

export interface ScreenData {
	type: ScreenType;
	uuid: string;
	name: string;
	children: string[];
}

export interface Store {
	loadScreens(): Promise<ScreenData[]>;
}
