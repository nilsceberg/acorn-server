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
		})
	}

	private send(message: any) {
		this.ws.send(JSON.stringify(message));
	}

	private close(reason?: string): State {
		console.log("Closing connection: " + reason);
		this.ws.close();
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
			return this.close("Registration not implemented");
		}

		if (screen instanceof Screen) {
			this.send({
				name: await screen.getName()
			});

			screen.setConnection(this);
			this.screen = screen;

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
}
