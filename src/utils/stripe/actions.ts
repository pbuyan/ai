"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./api";
import { withTeam } from "@/utils/supabase/middleware";

export const checkoutAction = withTeam(async (formData, user) => {
	const priceId = formData.get("priceId") as string;
	await createCheckoutSession({ user: user, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
	const portalSession = await createCustomerPortalSession(team);
	redirect(portalSession.url);
});
