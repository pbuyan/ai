"use client";

import { useUser } from "@/context/user";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Coins, LogOut, ReceiptText, Banknote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { logout } from "@/app/(login)/actions";

export default function UserDropdown({ billingPortalURL }: { billingPortalURL: string }) {
	const { user, session, isLoading } = useUser();

	console.log("user: ", user);
	console.log("session: ", session);
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className="cursor-pointer size-9">
						<AvatarImage alt={user?.email || ""} />
						<AvatarFallback className="uppercase">
							{user?.email
								?.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="flex flex-col gap-1">
					<DropdownMenuGroup>
						<div className="p-2">
							{user && <p className="truncate text-sm font-medium">{user?.name}</p>}
							<p className="truncate text-sm text-gray-500">{user?.email}</p>
						</div>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="space-x-2" disabled>
						<Coins className="h-4 w-4" />
						<p className="text-sm">{user?.remainingUsage}</p>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						<Link href="/pricing" className="flex w-full items-center">
							<Banknote className="mr-2 h-4 w-4" />
							<span>Pricing</span>
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
		</>
	);
}
