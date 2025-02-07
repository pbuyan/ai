import { checkoutAction } from "@/utils/stripe/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/utils/stripe/api";
import { SubmitButton } from "./submit-button";
import { getAuthUser } from "@/utils/supabase/actions";
import { Badge } from "@/components/ui/badge";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
	const authUser = await getAuthUser();
	const activePlan = authUser?.activePlan;
	const [prices, products] = await Promise.all([getStripePrices(), getStripeProducts()]);

	const creditsPlan = products.find((product) => product.name === "Starter");
	const subscriptionPlan = products.find((product) => product.name === "Pro");

	const creditsPrice = prices.find((price) => price.productId === creditsPlan?.id);
	const subscriptionPrice = prices.find((price) => price.productId === subscriptionPlan?.id);

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
					features={[
						"Everything in Base, and:",
						"Early Access to New Features",
						"24/7 Support + Slack Access",
					]}
					priceId={subscriptionPrice?.id}
					mode={"subscription"}
					activePlan={activePlan as string}
				/>
			</div>
		</main>
	);
}

function PricingCard({
	name,
	price,
	interval,
	features,
	priceId,
	mode,
	activePlan,
}: {
	name: string;
	price: number;
	interval?: string;
	features: string[];
	priceId?: string;
	mode: "subscription" | "payment";
	activePlan: string | null;
}) {
	return (
		<div className="pt-6">
			<div className="flex">
				<h2 className="text-2xl font-medium text-primary mb-2">{name}</h2>
				{name == activePlan && (
					<Badge variant="outline" className="h-4">
						Current
					</Badge>
				)}
			</div>
			{/* <p className="text-sm text-gray-600 mb-4">with {trialDays} day free trial</p> */}
			<p className="text-4xl font-medium text-primary mb-6">
				${price / 100} {interval && <span className="text-xl font-normal text-gray-600">/{interval}</span>}
			</p>
			<ul className="space-y-4 mb-8">
				{features.map((feature, index) => (
					<li key={index} className="flex items-start">
						<Check className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
						<span className="text-gray-700 dark:text-gray-500">{feature}</span>
					</li>
				))}
			</ul>
			<form action={checkoutAction}>
				<input type="hidden" name="priceId" value={priceId} />
				<input type="hidden" name="mode" value={mode} />
				<SubmitButton plan={name} activePlan={activePlan} />
			</form>
		</div>
	);
}
