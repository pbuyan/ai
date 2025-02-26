"use client";
import { runGoogleAi, runGoogleAiTranslate } from "@/app/(dialogue)/actions";
import DialogCard from "@/components/dialog-card";
import { useState } from "react";
import DialogueForm from "./dialogue-form";
import { useUser } from "@/context/user";
import { getLanguageName } from "@/lib/utils";

export default function Dialogue() {
	const [dialogue, setDialogue] = useState("");
	const [translatedDialogue, setTranslatedDialogue] = useState("");
	const [language, setLanguage] = useState("en-US");
	const [translationLanguage, setTranslationLanguage] = useState("fr");
	const [generating, setGenerating] = useState(false);
	const [translationGenerating, setTransletionGenerating] = useState(false);

	const { fetchAuthUser, user } = useUser();

	const handleDialogueUpdate = (res: string) => {
		setDialogue(res);
	};

	const handleLanguageUpdate = (lang: string) => {
		setLanguage(lang);
	};

	const handleTranslationLanguageUpdate = (lang: string) => {
		setTranslationLanguage(lang);
	};

	const handleGenerateClick = (isGenerating: boolean) => {
		setGenerating(isGenerating);
	};

	const handleTranslatedDialiogUpdate = (dialog: string) => {
		setTranslatedDialogue(dialog);
	};

	const handleGenerateDialogue = async (
		topic: string,
		customTopic: string,
		tone: string,
		language: string,
		level: string,
	) => {
		handleGenerateClick(true);
		handleDialogueUpdate("");
		handleTranslatedDialiogUpdate("");
		// updateDialogue("");

		const topicSelected = customTopic || topic;

		try {
			const result = await runGoogleAi(topicSelected, tone, language as string, level);
			handleDialogueUpdate(result.text as string);
			handleTranslatedDialiogUpdate("");
			fetchAuthUser();
		} catch (err) {
			console.error(err);
		} finally {
			handleGenerateClick(false);
		}
	};

	const handleTranslationGenerateClick = async () => {
		setTransletionGenerating(true);

		try {
			const translation = await runGoogleAiTranslate(dialogue, language, translationLanguage);
			handleTranslatedDialiogUpdate(translation.text as string);

			fetchAuthUser();
		} catch (error) {
			console.error(error);
		} finally {
			setTransletionGenerating(false);
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
