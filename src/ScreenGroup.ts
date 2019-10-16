import { LogicalScreen } from "./LogicalScreen";
import { Store, ScreenData } from "./stores/Store";
import { Connection } from "./net/Connection";

export class ScreenGroup implements LogicalScreen {
	private data: ScreenData;
	private children: LogicalScreen[] = [];

	constructor(data?: ScreenData) {
		this.data = data;
	}

	public async getName(): Promise<string> {
		return this.data ? this.data.name : "root";
	}

	public async setName(): Promise<string> {
		return this.data ? this.data.name : "root";
	}

	public async getUuid(): Promise<string> {
		return this.data ? this.data.uuid : "202d849a-030b-4046-8de0-04d474e2c0da";
	}

	public async getSubScreens(): Promise<LogicalScreen[]> {
		return [this];
	}

	public async load(data: ScreenData[]) {
	}

	public async start() {

	}
}
