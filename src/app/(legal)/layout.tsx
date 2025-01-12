import Footer from "@/components/footer";
import Header from "@/components/header";

export default function LeagalLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="flex flex-col">
			<Header />
			<main className="bg-background">
				<div className="flex flex-wrap prose prose-h1:text-primary prose-h2:text-primary prose-h3:text-primary prose-a:text-primary mx-auto text-primary my-20">
					<div>{children}</div>
				</div>
			</main>
			<Footer />
		</section>
	);
}
