CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"plan" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
