"use client";
import { useState } from "react";
import DialogueForm from "./dialogue-form";
import DialogueText from "./dialogue-text";

export default function Dialogue({ teamData }: { teamData: unknown }) {
  const [dialogue, setDialogue] = useState("");
  const [language, setLanguage] = useState("en-US");

  const handleDialogueUpdate = (res: string) => {
    setDialogue(res);
  };

  const handleLanguageUpdate = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/3 p-4">
        <div className="h-auto md:h-screen flex px-4">
          <DialogueForm
            teamData={teamData}
            onDialogueUpdate={handleDialogueUpdate}
            language={language}
          />{" "}
        </div>
      </div>
      <div className="w-full md:w-1/3 p-4">
        <div className="flex items-center justify-center">
          <DialogueText
            text={dialogue}
            language={language}
            onLanguageUpdate={handleLanguageUpdate}
          />
        </div>
      </div>
      <div className="w-full md:w-1/3 p-4">
        <div className="bg-cyan-400 h-32 md:h-64 flex items-center justify-center">
          Box 3
        </div>
      </div>
    </div>
  );
}
