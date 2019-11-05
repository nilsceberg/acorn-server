import WebSocket from "ws";
import { Server } from "../Server";
import { LogicalScreen } from "../LogicalScreen";
import { Screen } from "../Screen";
import { PlaylistItemType } from "../PlaylistItem";

type State = (message: any) => Promise<State>;

export class Connection {
	private ws: WebSocket;
	private state: State;
	private server: Server;
	private screen: Screen;
	private closed: boolean = false;
	private heartbeat: boolean = true;
	private heart: NodeJS.Timeout;

	constructor(ws: WebSocket, server: Server) {
		this.server = server;
		this.ws = ws;
		this.state = this.initState;
	}

	public async start() {
		this.ws.on("message", async data => {
			try {
				const message = JSON.parse(data.toString());
				this.state = await this.state(message);
			} catch (e) {
				console.log(e);
				this.close("invalid JSON")
			}
		});

		this.ws.on("close", async data => {
			console.log("Connection lost");
			this.state = this.close("Client disconnected");
		});

		this.ws.on("pong", () => {
			this.heartbeat = true;
			console.log("pong");
		});

		this.heart = setInterval(() => {
			if (!this.heartbeat) {
				this.state = this.close("heartbeat lost", true);
			}
			else {
				this.heartbeat = false;
				this.ws.ping(() => {});
				console.log("ping");
			}
		}, 5000);
	}

	public isClosed(): boolean {
		return this.closed;
	}

	private send(message: any) {
		this.ws.send(JSON.stringify(message));
	}

	private close(reason?: string, force: boolean = false): State {
		console.log("Closing connection: " + reason);
		this.closed = true;
		clearInterval(this.heart);

		if (force) {
			this.ws.terminate();
		}
		else {
			this.ws.close();
		}

		if (this.screen) {
			this.screen.setConnection(null);
		}
		return this.disconnectedState;
	}

	private async initState(message: any): Promise<State> {
		if (!message.uuid) {
			return this.close("invalid hello");
		}

		const uuid = message.uuid;
		console.log(`[${this.ws.url}] Hello from ${uuid}`)

		const screen = this.server.getScreen(uuid);
		if (!screen) {
			this.server.register({
				uuid: message.uuid,
				hostname: message.hostname || null,
				ip: "0.0.0.0",
				connection: this,
			});
			this.send({
				pending: true
			});
			return this.connectedState;
		}

		if (screen instanceof Screen) {
			this.send({
				name: screen.getName()
			});

			this.screen = screen;
			screen.setConnection(this);

			return this.connectedState;
		}
		else {
			return this.close("Tried to connect as group");
		}
	}

	private async connectedState(message: any): Promise<State> {
		console.log("Message: ", message);
		return this.connectedState;
	}

	private async disconnectedState(message: any): Promise<State> {
		console.error("this shouldn't happen");
		return this.disconnectedState;
	}

	// These functions only make sense to call in the connectedState,
	// but that's the only time when anyone should have access to call them
	// anyway. Maybe add an assert or something!
	public identify(id: boolean) {
		this.send({
			identify: id
		});
	}

	public display(type: PlaylistItemType, data: any) {
		this.send({
			display: {
				type, data
			}
		});
	}

	public rename(name: string) {
		this.send({
			rename: name
		});
	}

	public welcome(name: string) {
		this.send({
			name: name
		});
	}

	public system(message: string) {
		this.send({
			system: message
		});
	}
}
