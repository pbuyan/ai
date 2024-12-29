import NavMobileMenu from "@/components/nav/nav-mobile-menu";
import Link from "next/link";

const links = [
	{ label: "Dialogue", href: "/dialogue" },
	{ label: "Pricing", href: "/pricing" },
];

export default function NavMenu() {
	return (
		<>
			<div className="sm:flex gap-4 hidden">
				{links.map((link) => (
					<Link
						href={link.href}
						className="text-sm font-medium hover:text-muted-foreground text-foreground"
						key={link.href}
					>
						{link.label}
					</Link>
				))}
			</div>

			<div className="sm:hidden flex items-center">
				<NavMobileMenu>
					<ul className="flex pb-8 flex-col items-stretch justify-center gap-x-1">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="group inline-flex h-9 w-full items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</NavMobileMenu>
			</div>
		</>
	);
}
