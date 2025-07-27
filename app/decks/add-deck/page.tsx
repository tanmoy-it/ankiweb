import { auth } from "@/lib/auth";
import AddDeckPageContent from "./content";
import { headers } from "next/headers";

export default async function AddDeckPage() {
	// await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a delay for loading state
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	const userId = session?.user.id;

	return (
		<AddDeckPageContent userId={userId as string} />
	);
}
