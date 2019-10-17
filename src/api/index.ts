import { typeDefs, ScreenResponse, PendingRegistrationScreen, PlaylistResponse, PlaylistItemResponse, ScheduleResponse } from "./types";
import { ApolloServer } from "apollo-server-koa";
import * as uuid from "uuid";
import { Server } from "../Server";
import { Screen } from "../Screen";
import { ScreenGroup } from "../ScreenGroup";
import { LogicalScreen } from "../LogicalScreen";
import { Playlist } from "../Playlist";
import { PlaylistItem, PlaylistItemType } from "../PlaylistItem";
import { Schedule } from "../Schedule";
import { WebsiteSettings, WebsiteSlide } from "../slides/Website";

export function createApolloServer(server: Server) {

	const pending: PendingRegistrationScreen[] = [
//		{
//			hostname: "outcast.internal.dsek.se",
//			ip: "192.168.86.173",
//			uuid: uuid.v4(),
//		},
//		{
//			ip: "83.41.199.13",
//			uuid: uuid.v4(),
//		},
	];

	const settingTypes: { [type: string]: string } = {
		[PlaylistItemType.Website]: "WebsiteSettings",
		[PlaylistItemType.Image]: "ImageSettings",
	}

	const serializeScreen = (screen: LogicalScreen): ScreenResponse => {
		return {
			name: screen.getName(),
			uuid: screen.getUuid(),
			connected: screen.isConnected(),
			identify: screen.getIdentify(),
		};
	}

	const serializePlaylistItem = (playlistItem: PlaylistItem): PlaylistItemResponse => ({
		name: playlistItem.getName(),
		settings: { __itemType: playlistItem.getType(), ...playlistItem.getSettings() },
		type: playlistItem.getType(),
	});

	const serializePlaylist = (playlist: Playlist): PlaylistResponse => (playlist ? {
		name: playlist.getName(),
		uuid: playlist.getUuid(),
		defaultDuration: playlist.getDefaultDuration(),
		items: playlist.getItems().map(serializePlaylistItem),
	} : null);

	const serializeSchedule = (schedule: Schedule): ScheduleResponse => ({
		name: schedule.getName(),
		uuid: schedule.getUuid(),
		playlist: serializePlaylist(schedule.getPlaylist()),
	});

	const resolvers = {
		Query: {
			screens: async () => {
				return server.getScreens()
					.filter(s => s.getParent() === null)
					.map(serializeScreen);
			},
			pendingRegistrations: () => pending,
			playlists: async () => {
				return server.getPlaylists()
					.map(serializePlaylist);
			},
			playlist: async (obj: any, args: { playlist: string }) => {
				const playlist = server.getPlaylist(args.playlist);
				if (playlist) {
					return serializePlaylist(playlist);
				}
				return null;
			}
		},
		Screen: {
			children: (parent: any, args: any, context: any, info: any): ScreenResponse[] => {
				console.log(parent);
				const parentScreen = server.getScreen(parent.uuid);
				if (parentScreen instanceof ScreenGroup) {
					return parentScreen.getChildren().map(serializeScreen);
				}
			}
		},
		PlaylistItemSettings: {
			__resolveType: (obj: any) => {
				return settingTypes[obj.__itemType];
			}
		},
		Mutation: {
			identify: (parent: any, args: any) => {
				const screen = server.getScreen(args.uuid);
				if (screen) {
					return screen.setIdentify(args.identify);
				}
				return false;
			},
			renameScreen: async (parent: any, args: { uuid: string, name: string }) => {
				const screen = server.getScreen(args.uuid);
				if (screen) {
					await screen.setName(args.name);
					return serializeScreen(screen);
				}
			},

			createPlaylist: async (parent: any, args: { name: string }): Promise<PlaylistResponse> => {
				return serializePlaylist(await server.createPlaylist(args.name));
			},
			renamePlaylist: async (parent: any, args: { playlist: string, name: string }): Promise<PlaylistResponse> => {
				const playlist = server.getPlaylist(args.playlist);
				if (playlist) {
					await playlist.setName(args.name);
					return serializePlaylist(playlist);
				}
			},
			deletePlaylist: async (parent: any, args: { playlist: string }): Promise<boolean> => {
				// Not implemented
				return false;
			},
			
			createSchedule: async (parent: any, args: { name: string }): Promise<ScheduleResponse> => {
				return serializeSchedule(await server.createSchedule(args.name));
			},
			renameSchedule: async (parent: any, args: { schedule: string, name: string }): Promise<ScheduleResponse> => {
				const schedule = server.getSchedule(args.schedule);
				if (schedule) {
					await schedule.setName(args.name);
					return serializeSchedule(schedule);
				}
			},
			deleteSchedule: async (parent: any, args: { schedule: string }): Promise<boolean> => {
				// Not implemented
				return false;
			},

			renamePlaylistItem: async (parent: any, args: { playlist: string, index: number, name: string }): Promise<PlaylistResponse> => {
				const playlist = server.getPlaylist(args.playlist);
				if (playlist) {
					await playlist.renameItem(args.index, args.name);
					return serializePlaylist(playlist);
				}
			},
			deletePlaylistItem: async (parent: any, args: { playlist: string, index: number }): Promise<PlaylistResponse> => {
				const playlist = server.getPlaylist(args.playlist);
				if (playlist) {
					await playlist.deleteItem(args.index);
					return serializePlaylist(playlist);
				}
			},
			movePlaylistItem: async (parent: any, args: { playlist: string, index: number, newIndex: number }): Promise<PlaylistResponse> => {
				const playlist = server.getPlaylist(args.playlist);
				if (playlist) {
					await playlist.moveItem(args.index, args.newIndex);
					return serializePlaylist(playlist);
				}
			},

			addPlaylistWebsiteItem: async (parent: any, args: { playlist: string, name: string, settings: WebsiteSettings }): Promise<PlaylistResponse> => {
				const playlist = server.getPlaylist(args.playlist);
				if (playlist) {
					const item = new WebsiteSlide(args.name, args.settings);
					await playlist.addItem(item);
					return serializePlaylist(playlist);
				}
			},
			modifyPlaylistWebsiteItem: async (parent: any, args: { playlist: string, index: number, settings: WebsiteSettings }): Promise<PlaylistResponse> => {
				const playlist = server.getPlaylist(args.playlist);
				if (playlist) {
					await playlist.modifyItem(args.index, PlaylistItemType.Website, args.settings);
					return serializePlaylist(playlist);
				}
			},

			setSchedulePlaylist: async (parent: any, args: { schedule: string, playlist: string }): Promise<ScheduleResponse> => {
				const schedule = server.getSchedule(args.schedule);
				const playlist = server.getPlaylist(args.playlist);
				if (schedule && playlist) {
					await schedule.setPlaylist(playlist);
					return serializeSchedule(schedule);
				}
			},

			setScreenSchedule: async (parent: any, args: { screen: string, schedule: string }): Promise<ScheduleResponse> => {
				const screen = server.getScreen(args.screen);
				const schedule = server.getSchedule(args.schedule);
				if (schedule && screen) {
					await screen.setSchedule(schedule);
					return serializeScreen(screen);
				}
			},
		},
	};

	return new ApolloServer({
		typeDefs, resolvers,
	});
}
