// "use client";

import { ModeToggle } from "@/components/mode-toggle";
import NavMenu from "@/components/nav/nav-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { eq } from "drizzle-orm";

import { Coins, Home, LogOut, ReceiptText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";
import logoSrc from "../../../public/images/say-it-better-logo.png";
import type { User } from "@supabase/supabase-js";

import { logout } from "@/app/(login)/actions";
import { generateStripeBillingPortalLink } from "@/utils/stripe/api";
import { db } from "@/utils/db/db";
import { users } from "@/utils/db/schema";

export default async function Nav({ user }: { user: User | null }) {
	const name = user?.user_metadata.full_name;
	const email = user?.email;
	let credits;
	console.log("user: ", user);

	if (user) {
		credits = (await db.select().from(users).where(eq(users.email, user!.email!)))[0].credits;
		console.log("credits: ", credits);
	}
	// const [isMenuOpen, setIsMenuOpen] = useState(false);
	// const router = useRouter();

	// async function handleSignOut() {
	// 	router.push("/");
	// }

	// const [isPending, startTransition] = useTransition();
	const billingPortalURL = user ? await generateStripeBillingPortalLink(user.email!) : "null";

	return (
		<div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
			<Link href="/" className="flex items-center">
				<Image src={logoSrc} className="h-9 w-9" alt="Logo" />
				<span className="ml-2 text-xl font-semibold text-foreground">SayItBetter </span>
			</Link>
			<div className="flex items-center space-x-4 ">
				<div className="ml-2">
					<ModeToggle />
				</div>
				{user ? (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer size-9">
									<AvatarImage alt={user.email || ""} />
									<AvatarFallback className="uppercase">
										{user.email
											?.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="flex flex-col gap-1">
								<DropdownMenuGroup>
									<div className="p-2">
										{name && <p className="truncate text-sm font-medium">{name}</p>}
										<p className="truncate text-sm text-gray-500">{email}</p>
									</div>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="space-x-2" disabled>
									<Coins className="h-4 w-4" />
									<p className="text-sm">{credits} Credits</p>
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<Link href="/settings" className="flex w-full items-center">
										<Home className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>

								<DropdownMenuItem>
									<ReceiptText className="mr-2 h-4 w-4" />
									<Link href={billingPortalURL}>Billing</Link>
								</DropdownMenuItem>

								{/* <DropdownMenuItem
									className="h-8 space-x-2"
									onSelect={(event) => {
										event.preventDefault();
										startTransition(async () => {
											await billing();
										});
									}}
								>
									<Receipt className="h-4 w-4" />
									{isPending ? (
										<LoadingDots color="#808080" />
									) : (
										<>
											<p className="text-sm">Billing</p>
										</>
									)}
								</DropdownMenuItem> */}
								<form action={logout} className="w-full">
									<button type="submit" className="flex w-full">
										<DropdownMenuItem className="w-full flex-1 cursor-pointer">
											<LogOut className="mr-2 h-4 w-4" />
											<span>Sign out</span>
										</DropdownMenuItem>
									</button>
								</form>
							</DropdownMenuContent>
						</DropdownMenu>
						<div className="sm:order-first">
							<NavMenu />
						</div>
					</>
				) : (
					<Button asChild className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full">
						<Link href="/sign-in">Sign In</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
