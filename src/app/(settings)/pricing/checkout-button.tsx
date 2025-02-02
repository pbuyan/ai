"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { checkout } from "@/utils/stripe/actions";
import { useTransition } from "react";

export default function (product: Product | null | undefined) {
	const [isPending, startTransition] = useTransition();

	const checkoutWithProps = checkout.bind(null, {
		price_id: "price_1Qhzs9Ew05PK7u0G6xSiLk1F",
		credits: 2000,
	});

	return (
		<Button
			className="w-24 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
			onClick={() => {
				startTransition(async () => {
					await checkoutWithProps();
				});
			}}
			disabled={isPending}
		>
			{isPending ? (
				<LoadingDots color="#808080" />
			) : (
				<>
					<p>Purchase</p>
				</>
			)}
		</Button>
	);
}
