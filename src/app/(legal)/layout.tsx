import Header from "@/components/header";

export default function LeagalLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="flex flex-col">
			<Header />
			{children}
		</section>
	);
}
