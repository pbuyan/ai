import { db } from "@/utils/db/db";
import { users } from "@/utils/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { isAfter } from "date-fns";

export async function getAuthUser() {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (!user || error) return null;

	try {
		const userFromDB = (await db.select().from(users).where(eq(users.email, user!.email!)))[0];
		const subscriptionEnd = userFromDB.subscription_expiry
			? new Date(userFromDB.subscription_expiry * 1000)
			: null;

		const isPayed =
			userFromDB.credits > 0 || (subscriptionEnd && isAfter(new Date(subscriptionEnd), new Date()));

		let remainingUsage = "";
		let activePlan = null;

		if (isPayed && subscriptionEnd && isAfter(new Date(subscriptionEnd), new Date())) {
			remainingUsage = "Unlimited";
			activePlan = "Pro";
		}

		if (
			(isPayed && !subscriptionEnd) ||
			(subscriptionEnd && !isAfter(new Date(subscriptionEnd), new Date()))
		) {
			remainingUsage = userFromDB.credits + " Credits";
			activePlan = "Starter";
		}

		const authUser = {
			id: userFromDB.id,
			name: userFromDB.name,
			email: userFromDB.email,
			plan: userFromDB.plan,
			stripe_id: userFromDB.stripe_id,
			credits: userFromDB.credits,
			subscription_expiry: subscriptionEnd,
			deleted_at: userFromDB.deleted_at,
			isPayed: isPayed,
			remainingUsage: remainingUsage,
			activePlan: activePlan,
		};
		return authUser;
	} catch (err) {
		console.error(err);
		return null;
	}
}
