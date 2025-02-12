import Pricing from "@/components/pricing/pricing";
import { getStripePrices, getStripeProducts } from "@/utils/stripe/api";
import { getAuthUser } from "@/utils/supabase/actions";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
	const authUser = await getAuthUser();
	const activePlan = authUser ? authUser.activePlan : "";
	const [prices, products] = await Promise.all([getStripePrices(), getStripeProducts()]);
	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<Pricing products={products} prices={prices} activePlan={activePlan} />
		</main>
	);
}
