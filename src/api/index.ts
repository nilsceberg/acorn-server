import { typeDefs, Screen } from "./types";
import { ApolloServer } from "apollo-server-koa";

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

const resolvers = {
	Query: {
		screens: () => screens,
	},
};

export const server = new ApolloServer({
	typeDefs, resolvers,
});
