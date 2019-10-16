import { LogicalScreen } from "./LogicalScreen";
import { Store, ScreenData } from "./stores/Store";
import { Connection } from "./net/Connection";

export class Screen implements LogicalScreen {
	private data: ScreenData;
	private connection: Connection;

	constructor(data: ScreenData) {
		this.data = data;
		this.connection = null;
	}

	public async getName(): Promise<string> {
		return this.data.name;
	}

	public async setName(): Promise<string> {
		return this.data.name;
		//return this.;
	}

	public async getUuid(): Promise<string> {
		return this.data.uuid;
	}

	public async getSubScreens(): Promise<LogicalScreen[]> {
		return [this];
	}

	public async start() {

	}
}