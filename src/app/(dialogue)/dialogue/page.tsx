import Dialogue from "@/components/dialogue/dialogue";
import DialogueForm from "@/components/dialogue/dialogue-form";
import { Button } from "@/components/ui/button";
// import { Settings } from "./settings";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

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
