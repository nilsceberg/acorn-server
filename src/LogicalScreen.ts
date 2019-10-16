import { ScreenRef } from "./ScreenRef";
import { ScreenGroup } from "./ScreenGroup";

export interface LogicalScreen {
	getSubScreens(): Promise<LogicalScreen[]>;
	getName(): Promise<string>;
	setName(name: string): Promise<string>;
	getUuid(): string;
	isConnected(): boolean;
	start(): Promise<void>;
	getParent(): ScreenGroup;
	setParent(parent: ScreenGroup): Promise<void>;
	setIdentify(identify: boolean): boolean;
	getIdentify(): boolean;
}
