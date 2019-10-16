import { LogicalScreen } from "./LogicalScreen";

export class ScreenRef {
	public readonly uuid: string;
	private screens: { [uuid: string]: LogicalScreen } = {};

	constructor(uuid: string, screens: { [uuid: string]: LogicalScreen }) {
		this.uuid = uuid;
		this.screens = screens;
	}

	public get(): LogicalScreen {
		return this.screens[this.uuid];
	}
}
