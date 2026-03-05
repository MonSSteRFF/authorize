import { Elysia } from "elysia";
import { configPlugin } from "./config/configPlugin.ts";
import { testController } from "./http/test/testController.ts";
import { cookiePlugin } from "./utils/cookiePlugin.ts";
import { corsPlugin } from "./utils/corsPlugin.ts";
import { envPlugin } from "./utils/envPlugin.ts";

const app = new Elysia()
	.use(envPlugin())
	.use(configPlugin())
	.use(corsPlugin())
	.use(cookiePlugin())

	.use(testController);

app.listen(app.store.config.server.port, (server) => {
	console.log(
		`🚀 Server is running at ${server.url.href} in ${Bun.env.NODE_ENV} mode`,
	);
});
