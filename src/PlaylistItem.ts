export enum PlaylistItemType {
	Website = "website",
	Image = "image",
}

export interface PlaylistItem {
	getType(): PlaylistItemType;
	getName(): string;
	getSettings(): any;
	getPlayerData(): any;
	getDuration(playlistDefault: number): number;
}
