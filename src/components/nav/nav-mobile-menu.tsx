import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

export default function ({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger>
				<MenuIcon />
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle className="text-center">Menu</DrawerTitle>
					<DrawerDescription className="sr-only">Navigation menu</DrawerDescription>
				</DrawerHeader>
				<div
					onKeyDown={(e) => {
						if (e.target instanceof HTMLElement && e.target.closest("a")) {
							setIsOpen(false);
						}
					}}
				>
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
