"use client";

import { runGoogleAi, runOpenAi } from "@/app/(dialogue)/actions";
import LevelList from "@/components/level/level-list";
import ToneList from "@/components/tones/tone-list";
import TopicList from "@/components/topics/topic-list";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, getLanguageName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LanguageSelect from "../languages/language-list";

const formSchema = z.object({
	topic: z.string().min(2, {
		message: "Please select a topic!",
	}),
	customTopic: z.string(),
	tone: z.string(),
	level: z.string(),
	language: z.string(),
});

export default function DialogueForm({
	// teamData,
	onDialogueUpdateAction,
	onGenerateClickAction,
	language,
	generating,
	onTranslatedDialiogUpdateAction,
	onLanguageUpdateAction,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// teamData: any;
	language: string;
	generating: boolean;
	onDialogueUpdateAction: (lang: string) => void;
	onGenerateClickAction: (isGenerating: boolean) => void;
	onTranslatedDialiogUpdateAction: (dialog: string) => void;
	onLanguageUpdateAction: (lang: string) => void;
}) {
	const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			topic: "",
			customTopic: "",
			tone: "Friendly and Approachable Warm",
			level: "intermediate",
			language,
		},
	});

	const isGenerationAllowed = true;
	// teamData.subscriptionStatus === "trialing" || teamData.subscriptionStatus === "active";

	const handleFormChange = () => {
		const { topic } = form.getValues();
		console.log("topic: ", topic);
		if (topic === "Custom My custom topic") {
			setShowCustomTopicInput(true);
			return;
		}
		form.setValue("customTopic", "");
		setShowCustomTopicInput(false);
	};

	const handleGenerateDialogue = async (data: {
		topic: string;
		customTopic: string;
		tone: string;
		level: string;
	}) => {
		const topic = data.topic;
		const customTopic = data.customTopic;
		const tone = data.tone;
		const level = data.level;

		const languageSelected = getLanguageName(language);

		if ((!topic && !customTopic) || (topic === "Custom My custom topic" && !customTopic)) {
			form.setError("customTopic", {
				type: "custom",
				message: "Please enter your topic.",
			});
			return;
		}

		onGenerateClickAction(true);
		handleDialogueUpdate("");

		let topicSelected = "";
		if (customTopic) {
			topicSelected = customTopic;
		} else {
			topicSelected = topic;
		}

		try {
			const data = await runGoogleAi(topicSelected, tone, languageSelected as string, level);
			handleDialogueUpdate(data.text as string);
		} catch (err) {
			console.error(err);
		} finally {
			onGenerateClickAction(false);
		}
	};

	const handleDialogueUpdate = (data: string) => {
		onDialogueUpdateAction(data);
		onTranslatedDialiogUpdateAction("");
	};

	const handleLanguageChange = (lang: string) => {
		onLanguageUpdateAction(lang);
	};

	return (
		<div className="w-full">
			<Form {...form}>
				<form
					onChange={handleFormChange}
					onSubmit={form.handleSubmit(handleGenerateDialogue)}
					className="space-y-6 h-full"
				>
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

					<FormField
						control={form.control}
						name="customTopic"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										onChange={field.onChange}
										value={field.value}
										className={cn("py-6", { hidden: !showCustomTopicInput })}
										placeholder={"Enter your topic"}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
						<Button type="submit" variant="destructive" disabled={generating || !isGenerationAllowed}>
							<Play className="h-5 w-5" />
							{generating ? "Generating..." : "Generate"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
