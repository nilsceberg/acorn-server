import { ScreenRef } from "./ScreenRef";
import { ScreenGroup } from "./ScreenGroup";

export interface LogicalScreen {
	getSubScreens(): Promise<LogicalScreen[]>;
	getName(): Promise<string>;
	setName(name: string): Promise<string>;
	getUuid(): string;
	start(): Promise<void>;
	getParent(): ScreenGroup;
	setParent(parent: ScreenGroup): Promise<void>;
}
