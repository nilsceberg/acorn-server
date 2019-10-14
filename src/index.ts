import Koa from "koa";
import KoaRouter from "koa-router";

import { server as apolloServer } from "./api/index";
import { nonExecutableDefinitionMessage } from "graphql/validation/rules/ExecutableDefinitions";

const server = new Koa();

const router = new KoaRouter();
router.get("/test", ctx => {
	ctx.body = "hello world";
});
server
	.use(router.routes())
	.use(router.allowedMethods());

apolloServer.applyMiddleware({ app: server, path: "/api" });

server.listen(8080, () => {
	console.log("Listening on port 8080");
});
