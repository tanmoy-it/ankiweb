"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Ico from "@/app/util-components/ico";
import TT from "@/app/util-components/ttip";
import { Deck } from "../types";
import ConfirmAction from "@/app/util-components/confirm-action";
import DeckSettingsModal from "./deck-settings-modal";
import { useCallback, useState } from "react";
import LoadingSpinner from "@/app/util-components/loading-spinner";

type DeckListProps = {
	loadingDecks: boolean;
	decks: Deck[];
	selectDeck: (deck: Deck) => void;
	handleDelete: (id: string) => void;
};

export default function DeckList({
	loadingDecks,
	decks,
	selectDeck,
	handleDelete,
}: DeckListProps) {
	const [deckSettingsID, setDeckSettingsID] = useState<string|undefined>(undefined)
	
	const handleCloseModal = useCallback(() => {
		setDeckSettingsID(undefined);
	}, []);

	return (
		<>
			<DeckSettingsModal deckID={deckSettingsID} onClose={handleCloseModal}></DeckSettingsModal>
			<ul className="space-y-2 items-center">
				{loadingDecks && (
					<div className="flex items-center justify-center h-32 m-10">
						<LoadingSpinner />
					</div>
				)}
				{!loadingDecks && decks.length === 0 && (
					<div className="flex items-center justify-center h-32">
						<p className="text-lg text-gray-500">No decks found.</p>
					</div>
				)}
				<AnimatePresence>
					{decks.map((deck, index) => (
						<motion.li
							key={index}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.2,
								delay: 0.1 * index,
							}}
							exit={{ opacity: 0, y: -10 }}
							className="flex justify-between items-center p-2 py-3 bg-dune-900/5 backdrop-blur-sm rounded-lg border-1 border-dashed border-dune-900/60 shadow-xl/20"
						>
							<span className="capitalize px-2">{deck.name}</span>
							<div className="flex gap-2">
								<TT tip="Deck Settings">
									<div onClick={() => setDeckSettingsID(deck.id)} className="px-2 py-1 hover:bg-white/10 rounded cursor-pointer flex items-center justify-center">
										<Ico
											src="https://cdn-icons-png.flaticon.com/128/503/503849.png"
											size={15}
											className="invert group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
										/>
									</div>
								</TT>
								<TT tip="Add and Manage Cards">
									<Link
										className="group"
										href={`/decks/add-card/${deck.id}`}
									>
										<div className="px-2 py-1 hover:bg-white/10 rounded cursor-pointer flex items-center justify-center">
											<Ico
												src="https://cdn-icons-png.flaticon.com/128/10024/10024739.png"
												size={15}
												className="invert group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
											/>
										</div>
									</Link>
								</TT>
								<TT tip="Edit Deck">
									<div
										onClick={() => selectDeck(deck)}
										className="px-2 py-1 hover:bg-white/10 rounded cursor-pointer flex items-center justify-center"
									>
										<Ico
											src="https://cdn-icons-png.flaticon.com/512/10573/10573605.png"
											size={15}
											className="invert"
										/>
									</div>
								</TT>
								<ConfirmAction
									onConfirm={() => handleDelete(deck.id)}
								>
									<div className="px-2 py-1 hover:bg-white/10 rounded cursor-pointer flex items-center justify-center">
										<Ico
											src="https://cdn-icons-png.flaticon.com/512/2710/2710178.png"
											size={15}
											className="invert"
										/>
									</div>
								</ConfirmAction>
							</div>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</>
	);
}
