import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<section className="flex flex-col min-h-screen bg-background">
			<Header />
			{children}
			<Footer />
		</section>
	);
}
