import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Elysia } from "elysia";
import { load } from "js-yaml";
import { z } from "zod";

const configSchema = z.object({
	server: z.object({
		port: z.number().default(3000),
		cors: z.object({
			origin: z.union([z.string(), z.array(z.string())]).default("*"),
			methods: z
				.array(z.string())
				.default(["GET", "POST", "PUT", "DELETE", "PATCH"]),
			allowedHeaders: z
				.array(z.string())
				.default(["Content-Type", "Authorization"]),
			credentials: z.boolean().default(true),
		}),
		cookie: z.object({
			httpOnly: z.boolean().default(true),
			secure: z.boolean().default(true),
			sameSite: z.enum(["lax", "strict", "none"]).default("lax"),
		}),
	}),
});

export type Config = z.infer<typeof configSchema>;

declare module "bun" {
	interface Env {
		MODE: "development" | "production" | "test";
	}
}

export const configPlugin = () => {
	const mode = Bun.env.MODE;
	const configPath = join(import.meta.dir, mode, "mainConfig.yml");

	let fileContents: string;
	try {
		fileContents = readFileSync(configPath, "utf8");
	} catch (e) {
		throw new Error(`❌ Config file not found at: ${configPath}`);
	}

	const rawConfig = load(fileContents);
	const parsed = configSchema.safeParse(rawConfig);

	if (!parsed.success) {
		console.error(
			`❌ Invalid YAML configuration [${mode}]:`,
			parsed.error.format(),
		);
		throw new Error("Invalid configuration file");
	}

	return new Elysia({ name: "config-plugin" })
		.state("config", parsed.data)
		.derive(({ store }) => ({
			config: store.config,
		}));
};
