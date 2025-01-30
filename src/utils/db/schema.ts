import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	plan: text("plan").notNull(),
	stripe_id: text("stripe_id").notNull(),
	credits: integer("credits").notNull(),
	subscription_expiry: text("subscription_expiry"),
	deleted_at: timestamp("deleted_at"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
