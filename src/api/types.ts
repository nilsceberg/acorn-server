import { gql } from "apollo-server-koa";

export interface ScreenResponse {
	name: string;
	uuid: string;
	connected?: boolean;
	identify?: boolean;
}

export interface PendingRegistrationScreen {
	hostname?: string;
	ip: string;
	uuid: string;
}

export const typeDefs = gql`
type Screen {
	name: String!
	uuid: String!
	connected: Boolean
	identify: Boolean
	children: [Screen]
}

type PendingRegistration {
	hostname: String
	ip: String!
	uuid: String!
}

type Query {
	screens: [Screen]!
	pendingRegistrations: [PendingRegistration]!
}

type Mutation {
	renameScreen(uuid: String!): Screen
	identify(uuid: String!, identify: Boolean!): Boolean!
}
`;
