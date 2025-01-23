"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/(login)/actions";
import { useState } from "react";
import { toast } from "sonner";

type UserAccountFormInputs = {
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
};

const userAccountSchema = z
	.object({
		name: z.string(),
		email: z.string().email("Invalid email format").nonempty("Email is required"),
		password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
		passwordConfirmation: z.string().nonempty("Password Confirmation is required"),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords must match",
		path: ["passwordConfirmation"],
	});

export default function SignupForm() {
	const [isSending, setIsSending] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserAccountFormInputs>({
		resolver: zodResolver(userAccountSchema),
	});

	const onSubmit: SubmitHandler<UserAccountFormInputs> = async (data) => {
		setIsSending(true);

		try {
			const result = await signup(data);

			if (!result.success) {
				toast.error(result.message, {
					position: "bottom-left",
				});
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while creating the account", {
				position: "bottom-left",
			});
		} finally {
			setIsSending(false);
		}
	};

	const renderInputField = (id: keyof UserAccountFormInputs, label: string, type: string) => (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input id={id} type={type} {...register(id)} error={errors[id]?.message} />
		</div>
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{renderInputField("name", "Name", "text")}
			{renderInputField("email", "Email", "email")}
			{renderInputField("password", "Password", "password")}
			{renderInputField("passwordConfirmation", "Confirm Password", "password")}

			<Button type="submit" size="lg" variant="default" className="w-full" disabled={isSending}>
				Create Account
			</Button>
		</form>
	);
}
