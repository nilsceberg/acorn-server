import { gql } from "apollo-server-koa";
import { PlaylistItemType } from "../PlaylistItem";

export interface ScreenResponse {
	name: string;
	uuid: string;
	group: boolean;
	connected?: boolean;
	identify?: boolean;
	schedule?: ScheduleResponse;
	parentUuid?: string;
}

export interface PlaylistItemResponse {
	name: string;
	settings: any;
	type: PlaylistItemType;
}

export interface PlaylistResponse {
	name: string;
	uuid: string;
	items: PlaylistItemResponse[];
	defaultDuration: number;
}

export interface PendingRegistrationScreen {
	hostname?: string;
	ip: string;
	uuid: string;
}

export interface ScheduleResponse {
	name: string;
	uuid: string;
	playlist?: PlaylistResponse;
}

export const typeDefs = gql`
type Screen {
	name: String!
	uuid: ID!
	group: Boolean!
	connected: Boolean
	identify: Boolean
	schedule: Schedule
	parent: Screen
}

type PendingRegistration {
	hostname: String
	ip: String!
	uuid: ID!
}

enum PlaylistItemType {
	WEBSITE, IMAGE
}

type WebsiteSettings {
	url: String!
	duration: Int!
}

input WebsiteSettingsInput {
	duration: Int!
	url: String!
}

union PlaylistItemSettings = WebsiteSettings

type PlaylistItem {
	name: String!
	type: PlaylistItemType!
	settings: PlaylistItemSettings!
}

type Playlist {
	name: String!
	uuid: ID!
	items: [PlaylistItem!]!
	defaultDuration: Int!
}

type Schedule {
	name: String!
	uuid: ID!
	playlist: Playlist
}

type Query {
	screens: [Screen]!
	screen(screen: ID!): Screen
	pendingRegistrations: [PendingRegistration]!
	playlists: [Playlist!]!
	playlist(playlist: ID!): Playlist
	schedules: [Schedule!]!
}

type Mutation {
	renameScreen(uuid: String!, name: String!): Screen
	identify(uuid: String!, identify: Boolean!): Boolean!
	
	createPlaylist(name: String!): Playlist!
	deletePlaylist(playlist: ID!): Boolean
	renamePlaylist(playlist: ID!, name: String!): Playlist

	createSchedule(name: String!): Schedule!
	deleteSchedule(schedule: ID!): Boolean
	renameSchedule(schedule: ID!, name: String!): Schedule

	renamePlaylistItem(playlist: ID!, index: Int!, name: String!): Playlist
	deletePlaylistItem(playlist: ID!, index: Int!): Playlist
	movePlaylistItem(playlist: ID!, index: Int!, newIndex: Int!): Playlist

	addPlaylistWebsiteItem(playlist: ID!, name: String!, settings: WebsiteSettingsInput!): Playlist
	modifyPlaylistWebsiteItem(playlist: ID!, index: Int!, settings: WebsiteSettingsInput!): Playlist

	setSchedulePlaylist(schedule: ID!, playlist: ID!): Schedule
	setScreenSchedule(screen: ID!, schedule: ID!): Screen
	
	acceptNew(screen: ID!, name: String!): Screen
}
`;
