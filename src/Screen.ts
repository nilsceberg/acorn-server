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
}
