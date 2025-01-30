"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./api";
import { withUser } from "@/utils/supabase/middleware";

export const checkoutAction = withUser(async (formData, user) => {
	const priceId = formData.get("priceId") as string;
	await createCheckoutSession({ user: user, priceId });
});

export const customerPortalAction = withUser(async (_, user) => {
	const portalSession = await createCustomerPortalSession(user);
	redirect(portalSession.url);
});
