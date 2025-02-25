"use client";

import { SubmitButton } from "@/components/pricing/submit-button";
import { Badge } from "@/components/ui/badge";
import { checkoutAction } from "@/utils/stripe/actions";
import { Check } from "lucide-react";

export default function PricingCard({
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
