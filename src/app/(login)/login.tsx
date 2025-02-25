"use client";

import { CircleIcon } from "lucide-react";
import Link from "next/link";
import AuthProviders from "@/components/auth-providers";
import SignupForm from "@/components/signup-form";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
	return (
		<div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					<CircleIcon className="h-12 w-12 text-destructive" />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold">
					{mode === "signin" ? "Sign in to your account" : "Create your account"}
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<SignupForm mode={mode} />

				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-primary-foreground  uppercase">Or continue with</span>
						</div>
					</div>

					<div className="mt-6 text-center text-sm text-gray-500">
						<AuthProviders />
					</div>

					<div className="mt-6">
						<Link
							href={`${mode === "signin" ? "/sign-up" : "/sign-in"}`}
							className="w-full flex justify-center py-2 px-4 font-medium hover:text-gray-500"
						>
							{mode === "signin" ? "Don't have an account? Sign up" : "Have an account? Sign in"}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
