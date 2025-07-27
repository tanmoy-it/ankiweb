import { db } from "@/lib/prisma/db";
import DynamicCardForm from "./dynamic-card-form";
import { addCardAction, getAllCards } from "../../actions/card-actions";
import CardsTable from "./cards-table";

export default async function AddCardPage({
	params,
}: {
	params: Promise<{ deckID: string }>;
}) {
	const { deckID } = await params;
	const deckName = await db.deck.findUnique({
		where: {
			id: deckID,
		},
		select: {
			name: true,
		},
	});
	const deckFields = await db.deckFieldDefinition.findMany({
		where: {
			deckId: deckID,
		},
		orderBy: {
			order: "asc",
		},
	});

	const allCards = await getAllCards(deckID);

	return (
		<div className="flex flex-col items-center justify-center bg-dune-950/20 border-2 border-dune-950/30 rounded-2xl text-dune-50">
			<h1 className="text-lg p-2 bg-linear-to-t from-white/[3%] to-transparent border-b-2 border-dune-500 mt-2 px-3">
				Add Cards To :{" "}
				<span className="font-bold text-dune-200">
					{deckName?.name || "Loading..."}
				</span>
			</h1>
			<div className="grid grid-cols-1 gap-2 w-full py-3 px-3">
				<div className="flex flex-col col-span-1 pr-5 gap-2 p-3">
					<h1 className="text-xl font-semibold text-dune-50 mb-2 underline underline-offset-5 decoration-dune-500/50 w-max bg-linear-to-t from-white/[3%] to-transparent">
						Add Card <span className="text-2xl">+</span>
					</h1>
					<DynamicCardForm
						deckID={deckID}
						deckFields={deckFields}
						serverAction={addCardAction}
					/>
				</div>
				<div className="p-3 col-span-2 pl-5">
					<CardsTable deckFields={deckFields} data={allCards ?? []} />
				</div>
			</div>
		</div>
	);
}
