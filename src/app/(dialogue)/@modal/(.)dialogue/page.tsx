"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Pricing from "@/components/pricing/pricing";

export default function ProductModal() {
	const router = useRouter();

	return (
		<Dialog open onOpenChange={() => router.back()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Product Details (Modal)</DialogTitle>
				</DialogHeader>
				<Pricing />
				<div className="space-y-2">
					<button
						onClick={() => router.back()}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Close
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
