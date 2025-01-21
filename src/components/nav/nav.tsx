"use client";

// import { signOut } from "@/app/(login)/actions";
import { ModeToggle } from "@/components/mode-toggle";
import NavMenu from "@/components/nav/nav-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useUser } from "@/lib/auth";
import { Home, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logoSrc from "../../../public/images/say-it-better-logo.png";
import type { User } from "@supabase/supabase-js";

interface UserProp extends User {
	name: string;
	email: string;
	image_url: string;
}

export default function Nav({ user }: { user: User | null }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();

	async function handleSignOut() {
		router.push("/");
	}
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
						<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
								<DropdownMenuItem className="cursor-pointer">
									<Link href="/settings" className="flex w-full items-center">
										<Home className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<form action={handleSignOut} className="w-full">
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
						<Link href="/sign-up">Sign Up</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
