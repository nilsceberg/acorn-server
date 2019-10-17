import { ScreenRef } from "./ScreenRef";
import { ScreenGroup } from "./ScreenGroup";
import { Schedule } from "./Schedule";

export interface LogicalScreen {
	setParent(parent: ScreenGroup): Promise<void>;
	setName(name: string): Promise<string>;
	setSchedule(schedule: Schedule): Promise<void>;
	getSubScreens(): LogicalScreen[];
	getUuid(): string;
	getName(): string;
	getParent(): ScreenGroup;

	initParent(): void;

	start(): Promise<void>;

	setIdentify(identify: boolean): boolean;
	getIdentify(): boolean;
	isConnected(): boolean;
}
