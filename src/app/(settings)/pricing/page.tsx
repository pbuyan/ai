// import { checkoutAction } from "@/lib/payments/actions";
// import { getStripePrices, getStripeProducts } from "@/utils/payments/stripe";
import { createStripeCheckoutSession } from "@/utils/stripe/api";
import { createClient } from "@/utils/supabase/server";
import { Check } from "lucide-react";
import { SubmitButton } from "./submit-button";
import StripePricingTable from "@/components/StripePricingTable";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	console.log("user: ", user);
	// const checkoutSessionSecret = await createStripeCheckoutSession(user?.email!);
	// const [prices, products] = await Promise.all([getStripePrices(), getStripeProducts()]);
	// console.log("prices: ", prices);
	// console.log("products: ", products);

	// const freePlan = products.find((product) => product.name === "Free");
	// const basePlan = products.find((product) => product.name === "Base");
	// const plusPlan = products.find((product) => product.name === "Plus");

	// const freePrice = prices.find((price) => price.productId === freePlan?.id);
	// const basePrice = prices.find((price) => price.productId === basePlan?.id);
	// const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
				{/* <PricingCard
					name={freePlan?.name || "Free"}
					price={freePrice?.unitAmount || 0}
					interval={freePrice?.interval || "month"}
					trialDays={freePrice?.trialPeriodDays || 7}
					features={["Unlimited dialogues", "3 translations/day", "Email Support"]}
					priceId={freePrice?.id}
				/>
				<PricingCard
					name={basePlan?.name || "Base"}
					price={basePrice?.unitAmount || 800}
					interval={basePrice?.interval || "month"}
					trialDays={basePrice?.trialPeriodDays || 7}
					features={["Unlimited dialogues", "3 translations/day", "Email Support"]}
					priceId={basePrice?.id}
				/>
				<PricingCard
					name={plusPlan?.name || "Plus"}
					price={plusPrice?.unitAmount || 1200}
					interval={plusPrice?.interval || "month"}
					trialDays={plusPrice?.trialPeriodDays || 7}
					features={["Unlimited dialogues", "Unlimited translation", "Advanced AI model"]}
					priceId={plusPrice?.id}
				/> */}
				{/* <StripePricingTable checkoutSessionSecret={checkoutSessionSecret} /> */}
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
}: {
	name: string;
	price: number;
	interval: string;
	trialDays: number;
	features: string[];
	priceId?: string;
}) {
	return (
		<div className="pt-6">
			<h2 className="text-2xl font-medium mb-2">{name}</h2>
			<p className="text-sm text-primary mb-4">with {trialDays} day free trial</p>
			<p className="text-4xl font-medium mb-6">
				${price / 100} <span className="text-xl font-normal text-primary">{interval}</span>
			</p>
			<ul className="space-y-4 mb-8">
				{features.map((feature, index) => (
					<li key={feature} className="flex items-start">
						<Check className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
						<span className="text-primary">{feature}</span>
					</li>
				))}
			</ul>
			{/* <form action={checkoutAction}>
				<input type="hidden" name="priceId" value={priceId} />
				<SubmitButton />
			</form> */}
		</div>
	);
}
