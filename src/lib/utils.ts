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
