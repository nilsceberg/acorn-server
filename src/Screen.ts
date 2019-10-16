import { LogicalScreen } from "./LogicalScreen";
import { Store, ScreenData } from "./stores/Store";
import { Connection } from "./net/Connection";
import { ScreenRef } from "./ScreenRef";
import { ScreenGroup } from "./ScreenGroup";

export class Screen implements LogicalScreen {
	private name: string;
	private ref: ScreenRef;
	private parent: ScreenGroup;
	private connection: Connection;

	private identify: boolean = false;

	constructor(name: string, ref: ScreenRef) {
		this.name = name;
		this.ref = ref;
		this.parent = null;
		this.connection = null;
	}

	public async getName(): Promise<string> {
		return this.name;
	}

	public async setName(): Promise<string> {
		return this.name;
		//return this.;
	}

	public getUuid(): string {
		return this.ref.uuid;
	}

	public async getSubScreens(): Promise<LogicalScreen[]> {
		return [this];
	}

	public getParent(): ScreenGroup {
		return this.parent || null;
	}

	public async setParent(parent: ScreenGroup): Promise<void> {
		if (this.parent) {
			this.parent.removeChild(this.ref);
			parent.addChild(this.ref);
		}
		this.parent = parent;
	}

	public async start() {
		console.log(`Screen ${await this.getName()} started. <- ${this.getParent() ? await this.getParent().getName() : "root"}`);
	}

	public setConnection(connection: Connection) {
		this.connection = connection;

		if (connection) {
			this.setIdentify(true);
		}
		else {
			this.identify = false;
		}
	}
	
	public isConnected(): boolean {
		return this.connection !== null;
	}

	public setIdentify(identify: boolean): boolean {
		this.identify = identify;
		if (this.connection) {
			console.log("Sending identify = " + this.identify + " to " + this.name);
			this.connection.identify(this.identify);
		}
		return identify;
	}

	public getIdentify(): boolean {
		return this.identify;
	}
}
