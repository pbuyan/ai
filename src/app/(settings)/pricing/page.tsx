import Pricing from "@/components/pricing/pricing";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<Pricing />
		</main>
	);
}
