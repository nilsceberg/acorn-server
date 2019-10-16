export interface LogicalScreen {
	getSubScreens(): Promise<LogicalScreen[]>;
	getName(): Promise<string>;
	setName(name: string): Promise<string>;
	getUuid(): Promise<string>;
	start(): Promise<void>;
}
