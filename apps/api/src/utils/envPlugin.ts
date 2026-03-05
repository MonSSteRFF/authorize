import { Elysia } from "elysia";
import { z } from "zod/v4";

const envSchema = z.object({
	COOKIE_SECRET: z.string(),
});

export const envPlugin = () => {
	const parsed = envSchema.safeParse(Bun.env);

	if (!parsed.success) {
		console.error("❌ Invalid environment variables:", parsed.error);
		throw new Error("Invalid environment variables");
	}

	return new Elysia({ name: "env-plugin" })
		.state("env", parsed.data)
		.derive(({ store }) => ({
			env: store.env,
		}));
};
