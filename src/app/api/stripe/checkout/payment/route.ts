// import { setSession } from "@/lib/auth/session";
import { db } from "@/utils/db/drizzle";
import { users } from "@/utils/db/schema";
import { stripe } from "@/utils/stripe/api";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const sessionId = searchParams.get("session_id");

	if (!sessionId) {
		return NextResponse.redirect(new URL("/pricing", request.url));
	}

	try {
		const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

		if (!lineItems || lineItems.data.length === 0) {
			throw new Error("Invalid customer data from Stripe.");
		}

		const productId = lineItems.data[0]?.price?.product;
		if (typeof productId !== "string") {
			throw new Error("Invalid product ID from Stripe.");
		}

		const product = await stripe.products.retrieve(productId);

		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["customer"],
		});

		if (!session.customer || typeof session.customer === "string") {
			throw new Error("Invalid customer data from Stripe.");
		}

		const customerId = session.customer.id;

		const paymentId =
			typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

		if (!paymentId) {
			throw new Error("No payment found for this session.");
		}

		const plan = product.name;

		if (!plan) {
			throw new Error("No plan found for this payment.");
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
				plan: plan,
				credits: user[0].credits + 2000,
			})
			.where(eq(users.id, user[0].id));

		return NextResponse.redirect(new URL("/dialogue", request.url));
	} catch (error) {
		console.error("Error handling successful checkout:", error);
		return NextResponse.redirect(new URL("/error", request.url));
	}
}
