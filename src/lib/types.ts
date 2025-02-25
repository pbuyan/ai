import type { User } from "@/utils/db/schema";

export interface Product {
	id: string;
	price_id: string;
	name: string;
	description: string;
	price: number;
	credits: number;
}

export interface AuthUser extends User {
	remainingUsage?: string;
	isPayed?: boolean;
	activePlan?: string;
}

export interface StripeProduct {
	id: string;
	name: string;
	description: string;
	defaultPriceId?: string;
}

export interface StripePrices {
	id: string;
	productId: string;
	unitAmount: number | null;
	currency: string;
	interval: string | undefined;
	trialPeriodDays: number | null | undefined;
	type: string;
}
