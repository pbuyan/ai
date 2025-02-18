"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Pricing from "@/components/pricing/pricing";
import type { StripePrices, StripeProduct } from "@/lib/types";

export default function PricingDialogue({
	products,
	prices,
	activePlan,
}: { products: StripeProduct[]; prices: StripePrices[]; activePlan: string }) {
	const router = useRouter();
	// const searchParams = useSearchParams();

	// const isOpen = searchParams.get("modal") === "true";
	// console.log("isOpen: ", isOpen);

	return (
		<Dialog open onOpenChange={() => router.back()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Product Details (Modal)</DialogTitle>
				</DialogHeader>
				<Pricing products={products} prices={prices} activePlan={activePlan} />
				<div className="space-y-2">
					<button
						onClick={() => router.back()}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Close
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
