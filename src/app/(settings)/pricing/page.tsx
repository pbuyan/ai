import { checkoutAction } from "@/utils/stripe/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/utils/stripe/api";
import { SubmitButton } from "./submit-button";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
	const [prices, products] = await Promise.all([getStripePrices(), getStripeProducts()]);
	// console.log("products: ", products);
	// console.log("prices: ", prices);

	const creditsPlan = products.find((product) => product.name === "Starter");
	const subscriptionPlan = products.find((product) => product.name === "Pro");

	const creditsPrice = prices.find((price) => price.productId === creditsPlan?.id);
	const subscriptionPrice = prices.find((price) => price.productId === subscriptionPlan?.id);

	// console.log("creditsPrice: ", creditsPrice);
	// console.log("subscriptionPrice: ", subscriptionPrice);
	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
				<PricingCard
					name={creditsPlan?.name || "Credits"}
					price={creditsPrice?.unitAmount || 800}
					interval={creditsPrice?.interval}
					trialDays={creditsPrice?.trialPeriodDays || 7}
					features={["Get 2000 credits", "Unlimited Workspace Members", "Email Support"]}
					priceId={creditsPrice?.id}
					mode={"payment"}
				/>
				<PricingCard
					name={subscriptionPlan?.name || "Unlimited"}
					price={subscriptionPrice?.unitAmount || 1200}
					interval={subscriptionPrice?.interval || "month"}
					trialDays={subscriptionPrice?.trialPeriodDays || 7}
					features={[
						"Everything in Base, and:",
						"Early Access to New Features",
						"24/7 Support + Slack Access",
					]}
					priceId={subscriptionPrice?.id}
					mode={"subscription"}
				/>
			</div>
		</main>
	);
}

function PricingCard({
	name,
	price,
	interval,
	trialDays,
	features,
	priceId,
	mode,
}: {
	name: string;
	price: number;
	interval?: string;
	trialDays: number;
	features: string[];
	priceId?: string;
	mode: "subscription" | "payment";
}) {
	return (
		<div className="pt-6">
			<h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
			{/* <p className="text-sm text-gray-600 mb-4">with {trialDays} day free trial</p> */}
			<p className="text-4xl font-medium text-gray-900 mb-6">
				${price / 100} {interval && <span className="text-xl font-normal text-gray-600">/{interval}</span>}
			</p>
			<ul className="space-y-4 mb-8">
				{features.map((feature, index) => (
					<li key={index} className="flex items-start">
						<Check className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
						<span className="text-gray-700">{feature}</span>
					</li>
				))}
			</ul>
			<form action={checkoutAction}>
				<input type="hidden" name="priceId" value={priceId} />
				<input type="hidden" name="mode" value={mode} />
				<SubmitButton />
			</form>
		</div>
	);
}
