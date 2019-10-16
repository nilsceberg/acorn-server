import { typeDefs, Screen, PendingRegistration } from "./types";
import { ApolloServer } from "apollo-server-koa";
import * as uuid from "uuid";

const screens: Screen[] = [
	{
		name: "Kotte",
	},
	{
		name: "Zigge",
	},
	{
		name: "Screendump 1",
	},
	{
		name: "Screendump 2",
	},
	{
		name: "Screendump 3",
	},
];

const pending: PendingRegistration[] = [
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

const resolvers = {
	Query: {
		screens: () => screens,
		pendingRegistrations: () => pending,
	},
};

export const server = new ApolloServer({
	typeDefs, resolvers,
});
