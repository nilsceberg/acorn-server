import Koa from "koa";
import KoaRouter from "koa-router";
import websockify from "koa-websocket";

import { server as apolloServer } from "./api/index";
import { Connection } from "./net/Connection";

const server = websockify(new Koa());

const router = new KoaRouter();
router.get("/test", ctx => {
	ctx.body = "hello world";
});
server
	.use(router.routes())
	.use(router.allowedMethods());

apolloServer.applyMiddleware({ app: server, path: "/api" });

server.ws.use(ctx => {
	const conn = new Connection(ctx.websocket);
	conn.start();
});

server.listen(8080, () => {
	console.log("Listening on port 8080");
});
