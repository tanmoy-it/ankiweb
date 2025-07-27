import { getSessionForDeck } from "./deck-study-action";
import StudySession from "./comps/study-session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function StudyDeck({
	params,
}: {
	params: Promise<{ deckID: string }>;
}) {
	const { deckID } = await params;
	const session = await auth.api.getSession({headers: await headers()});
	const getSessionForToday = await getSessionForDeck(deckID, session?.user.id || "");
	if (getSessionForToday instanceof Error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<h1 className="text-2xl font-bold">{getSessionForToday.message}</h1>
			</div>
		);
	}
	return (
		<StudySession sessionData={getSessionForToday}/>
	)
}
