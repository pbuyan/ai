import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { createStripeCustomer } from "@/utils/stripe/api";
import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			const checkUserInDB = await db.select().from(usersTable).where(eq(usersTable.email, user!.email!));
			const isUserInDB = checkUserInDB.length > 0 ? true : false;
			if (!isUserInDB) {
				const stripeID = await createStripeCustomer(user!.id, user!.email!, user!.user_metadata.full_name);
				await db.insert(usersTable).values({
					id: user!.id,
					name: user!.user_metadata.full_name,
					email: user!.email!,
					stripe_id: stripeID,
					plan: "none",
				});
			}

			const forwardedHost = request.headers.get("x-forwarded-host");
			const isLocalEnv = process.env.NODE_ENV === "development";
			if (isLocalEnv) {
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
