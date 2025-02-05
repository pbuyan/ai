// import { setSession } from "@/lib/auth/session";
import { db } from "@/utils/db/drizzle";
import { users } from "@/utils/db/schema";
import { stripe } from "@/utils/stripe/api";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const sessionId = searchParams.get("session_id");

	if (!sessionId) {
		return NextResponse.redirect(new URL("/pricing", request.url));
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["customer", "subscription"],
		});

		if (!session.customer || typeof session.customer === "string") {
			throw new Error("Invalid customer data from Stripe.");
		}

		const customerId = session.customer.id;
		const subscriptionId =
			typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

		if (!subscriptionId) {
			throw new Error("No subscription found for this session.");
		}

		const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
			expand: ["items.data.price.product"],
		});

		const plan = subscription.items.data[0]?.price;

		if (!plan) {
			throw new Error("No plan found for this subscription.");
		}

		const productId = (plan.product as Stripe.Product).id;

		if (!productId) {
			throw new Error("No product ID found for this subscription.");
		}

		const userId = session.client_reference_id;
		if (!userId) {
			throw new Error("No user ID found in session's client_reference_id.");
		}

		const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

		if (user.length === 0) {
			throw new Error("User not found in database.");
		}

		await db
			.update(users)
			.set({
				stripe_id: customerId,
				plan: (plan.product as Stripe.Product).name,
				credits: user[0].credits + 2000,
				subscription_expiry: subscription.current_period_end,
			})
			.where(eq(users.id, user[0].id));

		return NextResponse.redirect(new URL("/dialogue", request.url));
	} catch (error) {
		console.error("Error handling successful checkout:", error);
		return NextResponse.redirect(new URL("/error", request.url));
	}
}
