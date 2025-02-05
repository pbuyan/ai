import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/theme";
import { UsageProvider } from "@/context/usage";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
	title: "SayItBetter",
	description: "Say It Better, improve your speaking skills with dialogues",
};

export const viewport: Viewport = {
	maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
			suppressHydrationWarning
		>
			<body className="min-h-[100dvh] bg-gray-50">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<UsageProvider>{children}</UsageProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
