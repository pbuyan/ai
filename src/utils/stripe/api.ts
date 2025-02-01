import { Stripe } from "stripe";
import { redirect } from "next/navigation";
import { db } from "../db/db";
import { type User, users } from "../db/schema";
import { eq } from "drizzle-orm";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL
	? process.env.NEXT_PUBLIC_WEBSITE_URL
	: "http://localhost:3000";

export async function getStripePrices() {
	const prices = await stripe.prices.list({
		expand: ["data.product"],
		active: true,
		type: "recurring",
	});

	return prices.data.map((price) => ({
		id: price.id,
		productId: typeof price.product === "string" ? price.product : price.product.id,
		unitAmount: price.unit_amount,
		currency: price.currency,
		interval: price.recurring?.interval,
		trialPeriodDays: price.recurring?.trial_period_days,
	}));
}

export async function getStripeProducts() {
	const products = await stripe.products.list({
		active: true,
		expand: ["data.default_price"],
	});

	return products.data.map((product) => ({
		id: product.id,
		name: product.name,
		description: product.description,
		defaultPriceId:
			typeof product.default_price === "string" ? product.default_price : product.default_price?.id,
	}));
}
export async function getStripePlan(email: string) {
	const user = await db.select().from(users).where(eq(users.email, email));
	const subscription = await stripe.subscriptions.retrieve(user[0].plan);
	const productId = subscription.items.data[0].plan.product as string;
	const product = await stripe.products.retrieve(productId);
	return product.name;
}

export async function createStripeCustomer(id: string, email: string, name?: string) {
	const customer = await stripe.customers.create({
		name: name ? name : "",
		email: email,
		metadata: {
			supabase_id: id,
		},
	});
	// Create a new customer in Stripe
	return customer.id;
}

export async function createStripeCheckoutSession(email: string) {
	const user = await db.select().from(users).where(eq(users.email, email));
	const customerSession = await stripe.customerSessions.create({
		customer: user[0].stripe_id,
		components: {
			pricing_table: {
				enabled: true,
			},
		},
	});
	return customerSession.client_secret;
}

export async function generateStripeBillingPortalLink(email: string) {
	const user = await db.select().from(users).where(eq(users.email, email));
	const portalSession = await stripe.billingPortal.sessions.create({
		customer: user[0].stripe_id,
		return_url: `${PUBLIC_URL}/dialogue`,
	});
	return portalSession.url;
}

export async function createCheckoutSession({
	user,
	priceId,
}: {
	user: User;
	priceId: string;
}) {
	// const user = await getUser();

	if (!user) {
		redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.BASE_URL}/pricing`,
		customer: user.stripe_id || undefined,
		client_reference_id: user.id.toString(),
		allow_promotion_codes: true,
		subscription_data: {
			trial_period_days: 14,
		},
	});

	redirect(session.url!);
}

export async function createCustomerPortalSession(user: User) {
	if (!user.stripe_id) {
		redirect("/pricing");
	}

	let configuration: Stripe.BillingPortal.Configuration;
	const configurations = await stripe.billingPortal.configurations.list();

	if (configurations.data.length > 0) {
		configuration = configurations.data[0];
	} else {
		const product = await stripe.products.retrieve(team.stripeProductId);
		if (!product.active) {
			throw new Error("Team's product is not active in Stripe");
		}

		const prices = await stripe.prices.list({
			product: product.id,
			active: true,
		});
		if (prices.data.length === 0) {
			throw new Error("No active prices found for the team's product");
		}

		configuration = await stripe.billingPortal.configurations.create({
			business_profile: {
				headline: "Manage your subscription",
			},
			features: {
				subscription_update: {
					enabled: true,
					default_allowed_updates: ["price", "quantity", "promotion_code"],
					proration_behavior: "create_prorations",
					products: [
						{
							product: product.id,
							prices: prices.data.map((price) => price.id),
						},
					],
				},
				subscription_cancel: {
					enabled: true,
					mode: "at_period_end",
					cancellation_reason: {
						enabled: true,
						options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
					},
				},
			},
		});
	}

	return stripe.billingPortal.sessions.create({
		customer: team.stripeCustomerId,
		return_url: `${process.env.BASE_URL}/dashboard`,
		configuration: configuration.id,
	});
}
