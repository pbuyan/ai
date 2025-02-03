"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./api";
import { withTeam } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { getDomain } from "@/lib/utils";

export const checkoutAction = withTeam(async (formData, user) => {
	const priceId = formData.get("priceId") as string;
	const mode = formData.get("mode") as "subscription" | "payment";
	await createCheckoutSession({ user: user, priceId, mode });
});

export const customerPortalAction = withTeam(async (_, team) => {
	const portalSession = await createCustomerPortalSession(team);
	redirect(portalSession.url);
});

export async function checkout({
	price_id,
	credits,
}: {
	price_id: string;
	credits: number;
}) {
	const supabase = await createClient();

	const stripe = new Stripe(
		process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
			? process.env.STRIPE_SECRET_KEY!
			: process.env.STRIPE_SECRET_KEY_TEST!,
	);

	const { data: userData, error } = await supabase.from("users").select("*").single();
	if (error) {
		return { message: "Unable to get user data", status: 400 };
	}

	const stripeCheckoutSession = await stripe.checkout.sessions.create({
		customer:
			process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? userData.stripe_id! : userData.stripe_id_dev!,
		client_reference_id: userData?.id,
		// TODO: modal to show result
		success_url: getDomain(`/?success=true&credits=${credits}`),
		cancel_url: getDomain(`/?success=false&credits=${credits}`),
		line_items: [
			{
				price: price_id,
				quantity: 1,
			},
		],
		metadata: {
			credits: credits,
			dubCustomerId: userData.id,
		},
		invoice_creation: {
			enabled: true,
		},
		mode: "payment",
	});

	redirect(stripeCheckoutSession.url!);
}
