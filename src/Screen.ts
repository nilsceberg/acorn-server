import { LogicalScreen } from "./LogicalScreen";
import { Store, ScreenData } from "./stores/Store";
import { Connection } from "./net/Connection";
import { ScreenRef } from "./ScreenRef";
import { ScreenGroup } from "./ScreenGroup";
import { Schedule } from "./Schedule";
import { Condition } from "./util/Condition";

export class Screen implements LogicalScreen {
	private name: string;
	private ref: ScreenRef;
	private parent: ScreenGroup;
	private connection: Connection;
	private schedule: Schedule;

	private identify: boolean = false;

	private connectionCondition: Condition;

	constructor(name: string, ref: ScreenRef, schedule: Schedule) {
		this.name = name;
		this.ref = ref;
		this.parent = null;
		this.connection = null;
		this.schedule = schedule;
		this.connectionCondition = new Condition();
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
		}
		parent.addChild(this.ref);
		this.parent = parent;
	}

	public setConnection(connection: Connection) {
		this.connection = connection;

		if (connection) {
		}
		else {
			this.identify = false;
		}

		this.connectionCondition.notifyAll();
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

	public async start() {
		console.log(`Screen ${await this.getName()} started. <- ${this.getParent() ? await this.getParent().getName() : "root"}`);
		
		if (!this.schedule) {
			console.log("Äeh, vi skiter i detta. /" + await this.getName());
			return;
		}
		
		while (true) {
			console.log("Waiting for connection...");
			while (!this.connection) {
				await this.connectionCondition.wait();
			}
			console.log("Connection detected.");

			const playlist = this.schedule.getPlaylist();
			const pointer = playlist.play();

			while (this.connection) {
				const item = await Promise.race([pointer.next(), this.connectionCondition.wait()]);

				if (item) {
					if (this.connection) {
						this.connection.display(item.getType(), item.getPlayerData());
					}
				}
				else {
					console.log("Disconnection detected.");
				}
			}
		}
	}
}
