"use server";

import { db } from "@/utils/db/db";
import { users } from "@/utils/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { isAfter } from "date-fns";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

async function getSubabaseUser() {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (!user || error) return null;
	return user;
}

export async function getAuthUser() {
	const user = await getSubabaseUser();
	let isPayed = false;
	try {
		const userFromDB = (await db.select().from(users).where(eq(users.email, user!.email!)))[0];
		const subscriptionEnd = userFromDB.subscription_expiry
			? (new Date(userFromDB.subscription_expiry * 1000) as unknown as number)
			: null;

		if (userFromDB.credits > 0) {
			isPayed = true;
		}

		if (!isPayed && subscriptionEnd && isAfter(new Date(subscriptionEnd), new Date())) {
			isPayed = true;
		}
		// isPayed =
		// 	userFromDB.credits > 0 || (subscriptionEnd && isAfter(new Date(subscriptionEnd), new Date()));

		let remainingUsage = "";
		let activePlan = "";

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

export async function decreaseCredits(num = 20) {
	const user = await getSubabaseUser();
	const userFromDB = (await db.select().from(users).where(eq(users.email, user!.email!)))[0];
	const updatedCredits = Math.max(0, userFromDB.credits - num);

	const userToUpdate = { ...userFromDB, credits: updatedCredits };
	try {
		await db
			.update(users)
			.set({
				credits: updatedCredits,
			})
			.where(eq(users.id, userFromDB.id));

		// getAuthUser();

		// revalidatePath("/dialogue");
		revalidateTag("dialogue");
		// redirect("/dialogue");
	} catch (dbError) {
		console.error("Error updating user credits into database:", dbError);
	}
}
