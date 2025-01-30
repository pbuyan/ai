import { desc, and, eq, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import { users } from "./schema";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
// import { verifyToken } from "@/lib/auth/session";

export async function getUser() {
	const sessionCookie = (await cookies()).get("session");
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		return null;
	}

	// const sessionData = await verifyToken(sessionCookie.value);
	// if (!sessionData || !sessionData.user || typeof sessionData.user.id !== "number") {
	// 	return null;
	// }

	if (new Date(sessionData.expires) < new Date()) {
		return null;
	}

	const user = await db
		.select()
		.from(users)
		.where(and(eq(users.id, sessionData.user.id), isNull(users.deleted_at)))
		.limit(1);

	if (user.length === 0) {
		return null;
	}

	return user[0];
}
