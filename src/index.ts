import Koa from "koa";
import KoaRouter from "koa-router";
import websockify from "koa-websocket";

import { createApolloServer } from "./api/index";
import { Connection } from "./net/Connection";
import { Server } from "./Server";
import { JsonStore } from "./stores/JsonStore";

async function start() {
	console.log("Opening JSON store...")
	const jsonStore = new JsonStore("content.json");
	await jsonStore.load();

	console.log("Starting server...");
	const server = new Server(jsonStore);
	await server.load();
	console.log("Loaded.");

	console.log("Opening API...");
	const app = websockify(new Koa());

	const router = new KoaRouter();
	router.get("/test", ctx => {
		ctx.body = "hello world";
	});
	app
		.use(router.routes())
		.use(router.allowedMethods());

	createApolloServer(server).applyMiddleware({ app: app, path: "/api" });

	app.ws.use(ctx => {
		const conn = new Connection(ctx.websocket, server);
		conn.start();
	});

	app.listen(8080, () => {
		console.log("Listening on port 8080");
	});
}

start();
