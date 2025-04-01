"use client";

import { runGoogleAi, runGoogleAiTranslate } from "@/app/(dialogue)/actions";
import DialogCard from "@/components/dialog-card";
import { useState, useCallback } from "react";
import DialogueForm from "./dialogue-form";
import { useUser } from "@/context/user";

export default function Dialogue() {
	const [dialogue, setDialogue] = useState("");
	const [translatedDialogue, setTranslatedDialogue] = useState("");
	const [language, setLanguage] = useState("en-US");
	const [translationLanguage, setTranslationLanguage] = useState("fr");
	const [generating, setGenerating] = useState(false);
	const [translationGenerating, setTranslationGenerating] = useState(false);

	const { fetchAuthUser, user } = useUser();

	const handleDialogueUpdate = (res: string) => {
		setDialogue(res);
	};

	const handleLanguageUpdate = useCallback((lang: string) => setLanguage(lang), []);

	const handleTranslationLanguageUpdate = useCallback((lang: string) => setTranslationLanguage(lang), []);

	const handleGenerateDialogue = async (
		topic: string,
		customTopic: string,
		tone: string,
		language: string,
		level: string,
	) => {
		setGenerating(true);
		handleDialogueUpdate("");
		setTranslatedDialogue("");

		const topicSelected = customTopic || topic;

		try {
			const result = await runGoogleAi(topicSelected, tone, language as string, level);
			handleDialogueUpdate(result.text as string);
			setTranslatedDialogue("");
			fetchAuthUser();
		} catch (err) {
			console.error(err);
		} finally {
			setGenerating(false);
		}
	};

	const handleTranslationGenerateClick = async () => {
		setTranslationGenerating(true);

		try {
			const translation = await runGoogleAiTranslate(dialogue, language, translationLanguage);
			setTranslatedDialogue(translation.text as string);

			fetchAuthUser();
		} catch (error) {
			console.error(error);
		} finally {
			setTranslationGenerating(false);
		}
	};

	return (
		<div className="flex flex-wrap bg-background">
			<aside className="settings w-full md:w-1/4 p-4 border-r">
				<div className="h-auto md:h-[calc(100vh-101px)] flex px-4">
					<DialogueForm
						onGenerateDialogueAction={handleGenerateDialogue}
						language={language}
						generating={generating}
						onLanguageUpdateAction={handleLanguageUpdate}
						user={user}
					/>{" "}
				</div>
			</aside>
			<main className="flex w-full md:w-3/4 p-4 gap-4">
				<div className="w-full">
					<DialogCard
						text={dialogue}
						translatedDialogue={translatedDialogue}
						language={language}
						onTranslationLanguageUpdate={handleTranslationLanguageUpdate}
						generating={generating}
						generatingTranslation={translationGenerating}
						onTranslationGenerateClick={handleTranslationGenerateClick}
						translationLanguage={translationLanguage}
					/>
				</div>
			</main>
		</div>
	);
}
