import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getURL = (input: string = "") => {
    return process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}${input}`
      : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${input}`
        : `http://localhost:3000${input}`;
  };

  // run `pnpm tunnel` and set TUNNEL_URL
  export const getDomain = (input: string = "") => {
    const domain =
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : process.env.TUNNEL_URL!;
  
    return domain + input;
  };