import PricingDialogue from "@/app/(dialogue)/modal/(.)dialogue/pricing-dialogue";
import { getStripePrices, getStripeProducts } from "@/utils/stripe/api";
import { getAuthUser } from "@/utils/supabase/actions";
import { Suspense } from "react";

export default async function ProductModal() {
	const authUser = await getAuthUser();
	const activePlan = authUser ? authUser.activePlan : "";
	const [prices, products] = await Promise.all([getStripePrices(), getStripeProducts()]);
	return (
		<>
			<PricingDialogue products={products} prices={prices} activePlan={activePlan} />
		</>
	);
}
