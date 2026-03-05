import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { configPlugin } from "../config/configPlugin";

export const corsPlugin = () => {
	return new Elysia({ name: "cors-plugin" })
		.use(configPlugin())
		.derive(({ store }) => {
			const { config } = store;

			return {
				corsOptions: {
					origin: config.server.cors?.origin ?? "*",
					methods: config.server.cors?.methods ?? [
						"GET",
						"POST",
						"PUT",
						"DELETE",
						"PATCH",
					],
					allowedHeaders: config.server.cors?.allowedHeaders ?? [
						"Content-Type",
						"Authorization",
					],
					credentials: config.server.cors?.credentials ?? true,
				},
			};
		})
		.use((app) => {
			const options = app.store.config.server.cors;
			return app.use(cors(options));
		});
};
