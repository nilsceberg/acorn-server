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

enum PlaylistItemType {
	Website, Image
}

type PlaylistItem {
	name: String!
	type: PlaylistItemType!
}

type Playlist {
	name: String!
	uuid: String!
	items: [PlaylistItem!]!
}

type Schedule {
	name: String!
	uuid: String!
	playlist: Playlist
}

type Query {
	screens: [Screen]!
	pendingRegistrations: [PendingRegistration]!
	playlists: [Playlist!]!
	playlist(uuid: String!): Playlist
}

type Mutation {
	renameScreen(uuid: String!): Screen
	identify(uuid: String!, identify: Boolean!): Boolean!
}
`;
