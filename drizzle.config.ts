import type { Config } from "drizzle-kit";
import { config } from "dotenv";

process.env.NODE_ENV !== "production" ? config({ path: ".env" }) : config({ path: ".env.local" }); // or .env.local
config({ path: ".env.local" });

export default {
	schema: "./lib/db/schema.ts",
	out: "./lib/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.POSTGRES_URL!,
	},
} satisfies Config;
