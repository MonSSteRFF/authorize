import { cookie } from "@elysiajs/cookie";
import { Elysia } from "elysia";
import { configPlugin } from "../config/configPlugin";
import { envPlugin } from "./envPlugin.ts";

export const cookiePlugin = () => {
	return new Elysia({ name: "cookie-plugin" })
		.use(configPlugin())
		.use(envPlugin())
		.use((app) => {
			const cookieCfg = app.store.config.server.cookie;
			const cookieSecret = app.store.env.COOKIE_SECRET;

			return app.use(
				cookie({
					secret: cookieSecret,
					httpOnly: cookieCfg.httpOnly,
					secure: cookieCfg.secure,
					sameSite: cookieCfg.sameSite,
				}),
			);
		});
};
