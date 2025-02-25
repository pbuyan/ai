import { languages } from "@/components/languages/languages";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getLanguageName(code: string) {
	return languages.filter((lang) => {
		if (lang.code === code) {
			return lang.text;
		}
	})[0].text;
}

// run `pnpm tunnel` and set TUNNEL_URL
export const getDomain = (input = "") => {
	const domain =
		process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
			? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
			: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
				? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
				: process.env.TUNNEL_URL!;

	return domain + input;
};
