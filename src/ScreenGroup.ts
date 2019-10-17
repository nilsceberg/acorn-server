import { LogicalScreen } from "./LogicalScreen";
import { Store, ScreenData, ScreenType } from "./stores/Store";
import { Connection } from "./net/Connection";
import { ScreenRef } from "./ScreenRef";
import { Screen } from "./Screen";
import { Schedule } from "./Schedule";

export class ScreenGroup implements LogicalScreen {
	private name: string;
	private ref: ScreenRef;
	private children: ScreenRef[] = [];
	private parent: ScreenGroup;
	private store: Store;
	private parentRef: ScreenRef;

	constructor(name: string, ref: ScreenRef, parentRef: ScreenRef, store: Store) {
		this.name = name;
		this.ref = ref;
		this.parentRef = parentRef;
		this.parent = null;
		this.store = store;
	}

	private save(): Promise<void> {
		return this.store.saveScreen({
			uuid: this.getUuid(),
			name: this.name,
			parent: this.parent ? this.parent.getUuid() : null,
			type: ScreenType.Group,
			schedule: null,
		});
	}

	public getName(): string {
		return this.name;
	}

	public getUuid(): string {
		return this.ref.uuid;
	}

	public getSubScreens(): LogicalScreen[] {
		return this.children.map(c => c.get());
	}

	public getParent(): ScreenGroup {
		return this.parent;
	}

	public async setName(name: string): Promise<string> {
		this.name = name;
		await this.save();
		return this.name;
	}

	public setSchedule(schedule: Schedule): Promise<void> {
		//this.schedule = schedule;
		return this.save();
	}

	public initParent() {
		const group = this.parentRef.get();
		if (group instanceof ScreenGroup) {
			this.parent = group;
			group.addChild(this.ref);
		}
	}

	public async setParent(parent: ScreenGroup): Promise<void> {
		if (this.parent) {
			this.parent.removeChild(this.ref);
		}
		this.parent = parent;
		this.parent.addChild(this.ref);
		await this.save();
	}

	// WARNING: only call from setParent
	// This isn't cleaned up yet because I'm not sure on the model
	public removeChild(child: ScreenRef) {
		this.children = this.children.filter(
			c => (c.get().getUuid()) !== child.uuid
		)
	}

	// WARNING: only call from setParent
	public addChild(child: ScreenRef) {
		this.children.push(child);
	}

	public async start() {
		console.log(`Group ${this.getName()} started.`);
		console.log("Children: ");
		console.log(this.getChildren());
	}

	public getChildren(): LogicalScreen[] {
		return this.children.map(s => s.get());
	}
	
	public isConnected(): boolean {
		return null;
	}

	public getIdentify(): boolean {
		return false;
	}

	public setIdentify(): boolean {
		return false;
	}
}
