"use client";

import { runGoogleAi } from "@/app/(dialogue)/actions";
import LevelList from "@/components/level/level-list";
import ToneList from "@/components/tones/tone-list";
import TopicList from "@/components/topics/topic-list";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, getLanguageName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LanguageSelect from "../languages/language-list";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";

// Define a constant for the custom topic option to avoid magic strings
const CUSTOM_TOPIC_OPTION = "Custom My custom topic";

const formSchema = z.object({
	topic: z.string().min(2, { message: "Please select a topic!" }),
	customTopic: z.string(),
	tone: z.string(),
	level: z.string(),
	language: z.string(),
});

export default function DialogueForm({
	language,
	generating,
	onDialogueUpdateAction,
	onGenerateClickAction,
	onTranslatedDialogueUpdateAction, // corrected the typo here
	onLanguageUpdateAction,
}: {
	language: string;
	generating: boolean;
	onDialogueUpdateAction: (dialogue: string) => void;
	onGenerateClickAction: (isGenerating: boolean) => void;
	onTranslatedDialogueUpdateAction: (dialogue: string) => void;
	onLanguageUpdateAction: (lang: string) => void;
}) {
	const { fetchAuthUser, user } = useUser();
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

	// Use watch to conditionally render the custom topic input
	const selectedTopic = form.watch("topic");
	const showCustomTopicInput = selectedTopic === CUSTOM_TOPIC_OPTION;

	useEffect(() => {
		fetchAuthUser();
	}, [fetchAuthUser]);

	// A helper to update dialogue text and reset the translated dialogue
	const updateDialogue = (dialogue: string) => {
		onDialogueUpdateAction(dialogue);
		onTranslatedDialogueUpdateAction("");
	};

	const handleLanguageChange = (lang: string) => {
		onLanguageUpdateAction(lang);
	};

	const handleGenerateDialogue = async (formData: z.infer<typeof formSchema>) => {
		const { topic, customTopic, tone, level } = formData;
		const languageSelected = getLanguageName(language);

		if (!user?.isPayed) {
			router.push("/pricing");
			return;
		}

		if ((topic === CUSTOM_TOPIC_OPTION && !customTopic) || (!topic && !customTopic)) {
			form.setError("customTopic", {
				type: "custom",
				message: "Please enter your topic.",
			});
			return;
		}

		onGenerateClickAction(true);
		updateDialogue("");

		const topicSelected = customTopic || topic;

		try {
			const result = await runGoogleAi(topicSelected, tone, languageSelected as string, level);
			updateDialogue(result.text as string);
			fetchAuthUser();
		} catch (err) {
			console.error(err);
		} finally {
			onGenerateClickAction(false);
		}
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
						render={() => (
							<FormItem>
								<FormLabel className="text-md font-semibold">Language</FormLabel>
								<FormControl>
									<LanguageSelect size="md" value={language} onChange={handleLanguageChange} />
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
