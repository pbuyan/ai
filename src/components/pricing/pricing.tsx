"use client";

import PricingCard from "@/components/pricing/pricing-card";
import type { StripePrices, StripeProduct } from "@/lib/types";

export default function Pricing({
	products,
	prices,
	activePlan,
}: { products: StripeProduct[]; prices: StripePrices[]; activePlan: string }) {
	const creditsPlan = products ? products.find((product) => product.name === "Starter") : null;
	const subscriptionPlan = products ? products.find((product) => product.name === "Pro") : null;

	const creditsPrice = prices.find((price) => price.productId === creditsPlan?.id);
	const subscriptionPrice = prices.find((price) => price.productId === subscriptionPlan?.id);
	return (
		<div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
			<PricingCard
				name={creditsPlan?.name || "Credits"}
				price={creditsPrice?.unitAmount || 800}
				interval={creditsPrice?.interval}
				features={["Get 2000 credits", "Unlimited Workspace Members", "Email Support"]}
				priceId={creditsPrice?.id}
				mode={"payment"}
				activePlan={activePlan as string}
			/>

			<PricingCard
				name={subscriptionPlan?.name || "Unlimited"}
				price={subscriptionPrice?.unitAmount || 1200}
				interval={subscriptionPrice?.interval || "month"}
				features={["Everything in Base, and:", "Early Access to New Features", "24/7 Support + Slack Access"]}
				priceId={subscriptionPrice?.id}
				mode={"subscription"}
				activePlan={activePlan as string}
			/>
		</div>
	);
}
