import { typeDefs, ScreenResponse, PendingRegistrationScreen } from "./types";
import { ApolloServer } from "apollo-server-koa";
import * as uuid from "uuid";
import { Server } from "../Server";
import { Screen } from "../Screen";
import { ScreenGroup } from "../ScreenGroup";
import { LogicalScreen } from "../LogicalScreen";

export function createApolloServer(server: Server) {

	const pending: PendingRegistrationScreen[] = [
		{
			hostname: "outcast.internal.dsek.se",
			ip: "192.168.86.173",
			uuid: uuid.v4(),
		},
		{
			ip: "83.41.199.13",
			uuid: uuid.v4(),
		},
	];

	const serializeScreen = async (screen: LogicalScreen): Promise<ScreenResponse> => {
		return {
			name: await screen.getName(),
			uuid: screen.getUuid(),
			connected: screen.isConnected(),
			identify: screen.getIdentify(),
		};
	}

	const resolvers = {
		Query: {
			screens: async () => {
				return server.getScreens()
					.filter(s => s.getParent() === null)
					.map(serializeScreen);
			},
			pendingRegistrations: () => pending,
		},
		Screen: {
			children: (parent: any, args: any, context: any, info: any): Promise<ScreenResponse>[] => {
				console.log(parent);
				const parentScreen = server.getScreen(parent.uuid);
				if (parentScreen instanceof ScreenGroup) {
					return parentScreen.getChildren().map(serializeScreen);
				}
			}
		},
		Mutation: {
			identify: (parent: any, args: any) => {
				const screen = server.getScreen(args.uuid);
				if (screen) {
					return screen.setIdentify(args.identify);
				}
				return false;
			}
		},
	};

	return new ApolloServer({
		typeDefs, resolvers,
	});
}
