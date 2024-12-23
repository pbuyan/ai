"use client";
import { useState } from "react";
import DialogueForm from "./dialogue-form";
import DialogCard from "@/components/dialog-card";
import { runGoogleAiTranslate } from "@/app/(dialogue)/actions";

export default function Dialogue({ teamData }: { teamData: unknown }) {
  const [dialogue, setDialogue] = useState("");
  const [translatedDialogue, setTranslatedDialogue] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [translationLanguage, setTranslationLanguage] = useState("fr");
  const [generating, setGenerating] = useState(false);
  const [translationGenerating, setTransletionGenerating] = useState(false);

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

  const handleTranslationGenerateClick = async () => {
    setTransletionGenerating(true);

    try {
      const translation = await runGoogleAiTranslate(
        dialogue,
        language,
        translationLanguage
      );
      handleTranslatedDialiogUpdate(translation.text as string);
    } catch (error) {
      console.error(error);
    } finally {
      setTransletionGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap">
      <aside className="settings w-full md:w-1/4 p-4">
        <div className="h-auto md:h-screen flex px-4">
          <DialogueForm
            teamData={teamData}
            onDialogueUpdate={handleDialogueUpdate}
            onGenerateClick={handleGenerateClick}
            language={language}
            generating={generating}
            onTranslatedDialiogUpdate={handleTranslatedDialiogUpdate}
          />{" "}
        </div>
      </aside>
      <div className="flex w-full md:w-3/4 p-4  gap-4">
        <div className="w-full xl:w-1/2">
          <DialogCard
            text={dialogue}
            language={language}
            onLanguageUpdate={handleLanguageUpdate}
            generating={generating}
          />
        </div>
        <div className="w-full xl:w-1/2">
          <DialogCard
            text={translatedDialogue}
            language={translationLanguage}
            onLanguageUpdate={handleTranslationLanguageUpdate}
            generating={translationGenerating}
            onTranslationGenerateClick={handleTranslationGenerateClick}
          />
        </div>
      </div>
    </div>
  );
}
