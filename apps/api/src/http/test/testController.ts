import { Elysia } from "elysia";
import { z } from "zod/v4";

export const testController = new Elysia().get(
	"/test",
	({ body }) => `test: ${body}`,
	{
		body: z.string(),
		response: z.string(),
	},
);
