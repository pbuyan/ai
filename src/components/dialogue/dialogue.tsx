"use client";
import { useState } from "react";
import DialogueForm from "./dialogue-form";
import DialogueText from "./dialogue-text";
import DialogCard from "@/components/dialog-card";

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

  const handleTranslationGenerateClick = (isGenerating: boolean) => {
    setTransletionGenerating(isGenerating);
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/3 p-4">
        <div className="h-auto md:h-screen flex px-4">
          <DialogueForm
            teamData={teamData}
            onDialogueUpdate={handleDialogueUpdate}
            onGenerateClick={handleGenerateClick}
            language={language}
            generating={generating}
          />{" "}
        </div>
      </div>
      <div className="w-full md:w-1/3 p-4">
        {/* <div className="flex items-center justify-center"> */}
        {/* <DialogueText
            text={dialogue}
            language={language}
            onLanguageUpdate={handleLanguageUpdate}
            generating={generating}
          /> */}

        <DialogCard
          text={dialogue}
          language={language}
          onLanguageUpdate={handleLanguageUpdate}
          generating={generating}
        />
        {/* </div> */}
      </div>
      <div className="w-full md:w-1/3 p-4">
        <DialogCard
          text={translatedDialogue}
          language={translationLanguage}
          onLanguageUpdate={handleTranslationLanguageUpdate}
          generating={translationGenerating}
        />
      </div>
    </div>
  );
}
