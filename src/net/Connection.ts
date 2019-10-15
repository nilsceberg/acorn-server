import WebSocket from "ws";

type State = (message: any) => Promise<State>;

export class Connection {
	private ws: WebSocket;
	private state: State;

	constructor(ws: WebSocket) {
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
	}

	private send(message: any) {
		this.ws.send(JSON.stringify(message));
	}

	private close(reason?: string): State {
		console.log("Closing connection: " + reason);
		this.ws.close();
		return this.disconnectedState;
	}

	private async initState(message: any): Promise<State> {
		if (!message.uuid) {
			return this.close("invalid hello");
		}

		const uuid = message.uuid;
		console.log("Hello from " + uuid)
		this.send({
			name: "unnamed"
		});
		return this.connectedState;
	}

	private async connectedState(message: any): Promise<State> {
		console.log("Message: ", message);
		return this.connectedState;
	}

	private async disconnectedState(message: any): Promise<State> {
		console.error("this shouldn't happen");
		return this.disconnectedState;
	}
}
