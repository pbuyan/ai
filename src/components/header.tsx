import Nav from "@/components/nav/nav";
import { createClient } from "@/utils/supabase/server";
import { getStripePlan } from "@/utils/stripe/api";

export default async function Header() {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	// Get the user's plan from Stripe
	// const stripePlan = getStripePlan(user!.email!);
	return (
		<header className="border-b border-border bg-background">
			<Nav user={user} />
		</header>
	);
}
