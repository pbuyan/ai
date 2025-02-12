import Header from "@/components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/db/db";
import { users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
	title: "SayItBetter",
	description: "Say It Better, improve your speaking skills with dialogues",
};

export default async function Layout({
	children,
	modal,
}: { children: React.ReactNode; modal: React.ReactNode }) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/sign-in");
	}

	// check user plan in db
	const checkUserInDB = await db.select().from(users).where(eq(users.email, user!.email!));

	if (
		!checkUserInDB[0].credits &&
		(checkUserInDB[0].subscription_expiry || checkUserInDB[0].subscription_expiry)
	) {
		console.log("User has no plan selected");
		return redirect("/pricing");
	}
	return (
		<section className="flex flex-col min-h-screen">
			<Header />
			{children}
			{modal}
		</section>
	);
}
