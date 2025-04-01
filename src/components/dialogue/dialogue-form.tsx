"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import LevelList from "@/components/level/level-list";
import ToneList from "@/components/tones/tone-list";
import TopicList from "@/components/topics/topic-list";
import LanguageSelect from "../languages/language-list";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";
import { getLanguageName } from "@/lib/utils";
import type { AuthUser } from "@/lib/types";

const CUSTOM_TOPIC_OPTION = "Custom My custom topic";

const formSchema = z
	.object({
		topic: z.string().min(2, { message: "Please select a topic!" }),
		customTopic: z.string(),
		tone: z.string(),
		level: z.string(),
		language: z.string(),
	})
	.refine((data) => data.topic !== CUSTOM_TOPIC_OPTION || data.customTopic.trim() !== "", {
		message: "Please enter your topic.",
		path: ["customTopic"],
	});

interface DialogueFormProps {
	language: string;
	generating: boolean;
	onGenerateDialogueAction: (
		topic: string,
		customTopic: string,
		tone: string,
		level: string,
		language: string,
	) => void;
	onLanguageUpdateAction: (lang: string) => void;
	user: AuthUser | null;
}

export default function DialogueForm({
	language,
	generating,
	onGenerateDialogueAction,
	onLanguageUpdateAction,
	user,
}: DialogueFormProps) {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			topic: "Everyday Conversations Small Talk",
			customTopic: "",
			tone: "Friendly and Approachable Warm",
			level: "intermediate",
			language,
		},
	});

	const selectedTopic = form.watch("topic");
	const showCustomTopicInput = selectedTopic === CUSTOM_TOPIC_OPTION;

	const handleLanguageChange = (lang: string) => {
		form.setValue("language", lang);
		onLanguageUpdateAction(lang);
	};

	const handleGenerateDialogue = (formData: z.infer<typeof formSchema>) => {
		const { topic, customTopic, tone, level } = formData;
		const languageSelected = getLanguageName(language);

		if (!user?.isPayed) {
			router.push("/pricing");
			return;
		}

		const topicSelected = customTopic || topic;
		onGenerateDialogueAction(topicSelected, customTopic, tone, level, languageSelected as string);
	};

	return (
		<div className="w-full">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleGenerateDialogue)} className="space-y-6 h-full">
					<FormField
						control={form.control}
						name="topic"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md font-semibold">Topic</FormLabel>
								<FormControl>
									<TopicList size="md" onChange={field.onChange} value={field.value} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{showCustomTopicInput && (
						<FormField
							control={form.control}
							name="customTopic"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											onChange={field.onChange}
											value={field.value}
											className="py-6"
											placeholder="Enter your topic"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="tone"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md font-semibold">Tone</FormLabel>
								<FormControl>
									<ToneList size="md" onChange={field.onChange} value={field.value} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="level"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md font-semibold">Level</FormLabel>
								<FormControl>
									<LevelList size="md" onChange={field.onChange} value={field.value} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="language"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md font-semibold">Language</FormLabel>
								<FormControl>
									<LanguageSelect size="md" value={field.value} onChange={handleLanguageChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end py-4 content-end sticky bottom-0">
						<Button type="submit" variant="destructive" disabled={generating}>
							<Play className="h-5 w-5" />
							{generating ? "Generating..." : "Generate"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
