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
