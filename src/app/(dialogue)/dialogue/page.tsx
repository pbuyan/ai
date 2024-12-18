import { redirect } from "next/navigation";
// import { Settings } from "./settings";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import Dialogue from "@/components/dialogue/dialogue";

export default async function DialoguePage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const teamData = await getTeamForUser(user.id);

  if (!teamData) {
    throw new Error("Team not found");
  }

  return <Dialogue teamData={teamData} />;
}
