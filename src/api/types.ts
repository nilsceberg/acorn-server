import { gql } from "apollo-server-koa";

export interface Screen {
	name: string;
}

export interface PendingRegistration {
	hostname?: string;
	ip: string;
	uuid: string;
}

export const typeDefs = gql`
type Screen {
	name: String!
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
}
`;
