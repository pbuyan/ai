"use client";
import { useState } from "react";
import DialogueForm from "./dialogue-form";
import DialogueText from "./dialogue-text";

export default function Dialogue({ teamData }: { teamData: unknown }) {
  const [dialogue, setDialogue] = useState("");

  const handleDialogueUpdate = (res: string) => {
    setDialogue(res);
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="h-auto md:h-screen flex justify-center px-4">
          <DialogueForm
            teamData={teamData}
            onDialogueUpdate={handleDialogueUpdate}
          />{" "}
        </div>
        {/* <div className="md:fixed md:bottom-0">
      <Button className="">Generate</Button>
    </div> */}
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="flex items-center justify-center border border-slate-300">
          {/* <Dialogue /> */}
          <DialogueText text={dialogue} />
        </div>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="bg-cyan-400 h-32 md:h-64 flex items-center justify-center">
          Box 3
        </div>
      </div>
    </div>
  );
}
