export enum PlaylistItemType {
	Website = "WEBSITE",
	Image = "IMAGE",
}

export interface PlaylistItem {
	getType(): PlaylistItemType;
	getName(): string;
	getSettings(): any;
	getPlayerData(): any;
	getDuration(playlistDefault: number): number;
	setSettings(settings: any): void;
	setName(name: string): void;
}
