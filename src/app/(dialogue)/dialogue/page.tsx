import { redirect } from "next/navigation";
// import { Settings } from "./settings";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import DialogueForm from "@/components/dialogue/dialogue-form";
import Dialogue from "@/components/dialogue/dialogue";
import { Button } from "@/components/ui/button";

export default async function DialoguePage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const teamData = await getTeamForUser(user.id);

  if (!teamData) {
    throw new Error("Team not found");
  }

  return (
    <main>
      <Dialogue teamData={teamData} />
    </main>
  );
}
