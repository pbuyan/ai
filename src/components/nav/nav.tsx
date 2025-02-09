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

import { Coins, LogOut, ReceiptText, Banknote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logoSrc from "../../../public/images/say-it-better-logo.png";

import { logout } from "@/app/(login)/actions";
import { generateStripeBillingPortalLink } from "@/utils/stripe/api";
import { getAuthUser } from "@/utils/supabase/actions";
import UserDropdown from "@/components/nav/user-dropdown";

export default async function Nav() {
	const authUser = await getAuthUser();

	const billingPortalURL = authUser ? await generateStripeBillingPortalLink(authUser.email!) : "null";

	return (
		<div className="px-4 sm:px-6 lg:px-4 py-4 flex justify-between items-center">
			<Link href="/" className="flex items-center">
				<Image src={logoSrc} className="h-9 w-9" alt="Logo" />
				<span className="ml-2 text-xl font-semibold text-foreground">SayItBetter </span>
			</Link>
			<div className="flex items-center gap-4">
				{authUser ? (
					<UserDropdown billingPortalURL={billingPortalURL} />
				) : (
					<Button asChild className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full">
						<Link href="/sign-in">Sign In</Link>
					</Button>
				)}

				<div className="sm:order-first">
					<NavMenu />
				</div>
				<div>
					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
