"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
// import { usageCount } from "@/app/(dialogue)/actions";
// import { createSubscription } from "@/utils/stripe/api";

interface UsageContextType {}

const UsageContext = createContext<UsageContextType | null>(null);

export function UsageProvider({ children }: Readonly<{ children: ReactNode }>) {
	return <UsageContext.Provider value={null}>{children}</UsageContext.Provider>;
}

export function useUsage() {
	const context = useContext(UsageContext);
	if (context === null) {
		throw new Error("useUsage must be used within a UsageProvider");
	}
	return context;
}
