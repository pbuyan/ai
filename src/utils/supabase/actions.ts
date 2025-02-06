import { db } from "@/utils/db/db";
import { users } from "@/utils/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";

export async function getAuthUser() {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (!user || error) return null;

	try {
		const userFromDB = (await db.select().from(users).where(eq(users.email, user!.email!)))[0];
		const authUser = {
			id: userFromDB.id,
			name: userFromDB.name,
			email: userFromDB.email,
			plan: userFromDB.plan,
			stripe_id: userFromDB.stripe_id,
			credits: userFromDB.credits,
			subscription_expiry: userFromDB.subscription_expiry,
			deleted_at: userFromDB.deleted_at,
		};
		return authUser;
	} catch (err) {
		console.error(err);
		return null;
	}
}
