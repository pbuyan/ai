"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, signin } from "@/app/(login)/actions";
import { useState } from "react";
import { toast } from "sonner";

type UserAccountFormInputs = {
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
};

const userSignupSchema = z
	.object({
		name: z.string(),
		email: z.string().email("Invalid email format"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		passwordConfirmation: z.string().min(8),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords must match",
		path: ["passwordConfirmation"],
	});

const userSigninSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupForm({ mode }: { mode: "signin" | "signup" }) {
	const [isSending, setIsSending] = useState(false);

	const userSchema = mode === "signin" ? userSigninSchema : userSignupSchema;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserAccountFormInputs>({
		resolver: zodResolver(userSchema),
	});

	const onSubmit: SubmitHandler<UserAccountFormInputs> = async (data) => {
		setIsSending(true);

		const result = mode === "signup" ? await signup(data) : await signin(data);

		if (!result.success) {
			toast.error(result.message, {
				position: "bottom-left",
			});
		}

		setIsSending(false);
	};

	const renderInputField = (id: keyof UserAccountFormInputs, label: string, type: string) => (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input id={id} type={type} {...register(id)} error={errors[id]?.message} />
		</div>
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{mode === "signup" && renderInputField("name", "Name", "text")}
			{renderInputField("email", "Email", "email")}
			{renderInputField("password", "Password", "password")}
			{mode === "signup" && renderInputField("passwordConfirmation", "Confirm Password", "password")}

			<Button type="submit" size="lg" variant="default" className="w-full" disabled={isSending}>
				{mode === "signup" ? "Sign Up" : "Sign In"}
			</Button>
		</form>
	);
}
