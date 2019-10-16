import { LogicalScreen } from "./LogicalScreen";
import { Store, ScreenData } from "./stores/Store";
import { Connection } from "./net/Connection";
import { ScreenRef } from "./ScreenRef";
import { Screen } from "./Screen";

export class ScreenGroup implements LogicalScreen {
	private name: string;
	private ref: ScreenRef;
	private children: ScreenRef[] = [];
	private parent: ScreenGroup;

	constructor(name: string, ref: ScreenRef, children: ScreenRef[]) {
		this.name = name;
		this.ref = ref;
		this.children = children;
		this.parent = null;
	}

	public async getName(): Promise<string> {
		return this.name;
	}

	public async setName(): Promise<string> {
		return this.name;
	}

	public getUuid(): string {
		return this.ref.uuid;
	}

	public async getSubScreens(): Promise<LogicalScreen[]> {
		return this.children.map(c => c.get());
	}

	public removeChild(child: ScreenRef) {
		this.children = this.children.filter(
			c => (c.get().getUuid()) !== child.uuid
		)
	}

	public addChild(child: ScreenRef) {
		this.children.push(child);
	}

	public getParent(): ScreenGroup {
		return this.parent;
	}

	public async setParent(parent: ScreenGroup): Promise<void> {
		if (this.parent) {
			this.parent.removeChild(this.ref);
		}
		this.parent = parent;
		this.parent.addChild(this.ref);
	}

	public async start() {
		console.log(`Group ${await this.getName()} started.`);
		console.log("Children: ");
		console.log(this.getChildren());
	}

	public getChildren(): LogicalScreen[] {
		return this.children.map(s => s.get());
	}
}
