import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { createStripeCustomer } from "@/utils/stripe/api";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get("next") ?? "/dialogue";

	if (code) {
		const supabase = createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			const { data: userData, error: userError } = await supabase.auth.getUser();

			if (userError || !userData.user) {
				console.error("Error fetching user:", userError);
				return NextResponse.redirect(`${origin}/auth/auth-code-error`);
			}

			const user = userData.user;

			const checkUserInDB = await db.select().from(usersTable).where(eq(usersTable.email, user.email!));

			const isUserInDB = checkUserInDB.length > 0;

			if (!isUserInDB) {
				try {
					const stripeID = await createStripeCustomer(user.id, user.email!, user.user_metadata.full_name);

					await db.insert(usersTable).values({
						id: user.id,
						name: user.user_metadata.full_name,
						email: user.email!,
						stripe_id: stripeID,
						plan: "none",
					});
				} catch (dbError) {
					console.error("Error inserting user into database:", dbError);
					return NextResponse.redirect(`${origin}/auth/auth-code-error`);
				}
			}

			////////////////////////////////
			const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === "development";
			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
