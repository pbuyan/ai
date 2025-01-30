"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createStripeCustomer } from "@/utils/stripe/api";
import { db } from "@/utils/db/db";
import { users } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL
	? process.env.NEXT_PUBLIC_WEBSITE_URL
	: "http://localhost:3000";

interface SignInData {
	email: string;
	password: string;
}
interface SignUpData extends SignInData {
	name: string;
	passwordConfirmation: string;
}
export async function resetPassword(currentState: { message: string }, formData: FormData) {
	const supabase = createClient();
	const passwordData = {
		password: formData.get("password") as string,
		confirm_password: formData.get("confirm_password") as string,
		code: formData.get("code") as string,
	};
	if (passwordData.password !== passwordData.confirm_password) {
		return { message: "Passwords do not match" };
	}

	const { data } = await supabase.auth.exchangeCodeForSession(passwordData.code);

	let { error } = await supabase.auth.updateUser({
		password: passwordData.password,
	});
	if (error) {
		return { message: error.message };
	}
	redirect(`/forgot-password/reset/success`);
}

export async function forgotPassword(currentState: { message: string }, formData: FormData) {
	const supabase = createClient();
	const email = formData.get("email") as string;
	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${PUBLIC_URL}/forgot-password/reset`,
	});

	if (error) {
		return { message: error.message };
	}
	redirect(`/forgot-password/success`);
}
export async function signup(formData: SignUpData) {
	const supabase = createClient();

	const { name, email, password } = formData;

	try {
		// Check if user exists in our database first
		const existingDBUser = await db.select().from(users).where(eq(users.email, email));

		if (existingDBUser.length > 0) {
			return { success: false, message: "An account with this email already exists. Please login instead." };
		}

		const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
				data: {
					email_confirm: process.env.NODE_ENV !== "production",
					full_name: name,
				},
			},
		});

		if (signUpError) {
			if (signUpError.message.includes("already registered")) {
				return {
					success: false,
					message: "An account with this email already exists. Please login instead.",
				};
			}
			return { success: false, message: signUpError.message };
		}

		if (!signUpData?.user) {
			return { success: false, message: "Failed to create user" };
		}

		// create Stripe Customer Record using signup response data
		const stripeID = await createStripeCustomer(signUpData.user.id, signUpData.user.email!, name);

		// Create record in DB
		await db.insert(users).values({
			id: signUpData.user.id,
			name: name,
			email: signUpData.user.email!,
			stripe_id: stripeID,
			plan: "none",
			credits: 2000,
		});

		return {
			success: true,
			message: "Account created successfully.",
		};
	} catch (error) {
		console.error("Error in signup:", error);
		return { success: false, message: "Failed to setup user account" };
	}
}

export async function signin(formData: SignInData) {
	const supabase = createClient();

	const { email, password } = formData;

	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) {
		console.log("error: ", error);
		return { success: false, message: error.message };
	}

	return { success: true };

	// revalidatePath("/", "layout");
	// redirect("/dialogue");
}

export async function logout() {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();
	redirect("/");
}

export async function signInWithProvider(provider: "google" | "github") {
	const supabase = createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${PUBLIC_URL}/auth/callback`,
		},
	});

	if (data.url) {
		redirect(data.url);
	}
}
