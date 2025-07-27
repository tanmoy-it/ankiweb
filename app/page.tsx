"use client";
import Ico from "@/app/util-components/ico";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Deck } from "@/lib/generated/prisma";
import { getDecksAction } from "./decks/actions/deck-actions";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import DeckStatus from "./util-components/deck-status";
import { useSession } from "@/lib/auth-client";
import LoadingSpinner from "./util-components/loading-spinner";

export default function Home() {
	const [decks, setDecks] = useState<Deck[]>([]);
	const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { data } = useSession();

	useEffect(() => {
		const fetchDecks = async () => {
			try {
				setLoading(true);
				setError(null);
				if (!data?.user.id) return;

				const response = await getDecksAction(data.user.id);
				setDecks(response);
			} catch (error) {
				setError((error as Error).message || "Failed to fetch decks");
				console.error("Error fetching decks:", error);
			} finally {
				setLoading(false);
			}
		};

		if (data?.user.id) {
			fetchDecks();
		}
	}, [data]);

	return (
		<div className="bg-dune-950/10 flex flex-col items-center justify-center rounded-xl shadow-xl shadow-black/10 w-full max-w-7xl mx-auto">
			<h1 className="text-lg sm:text-xl lg:text-2xl font-bold my-1 sm:my-3 uppercase tracking-[6px] sm:tracking-[8px] lg:tracking-[10px] text-center px-2">
				Anki Web
				<Ico
					src="https://cdn-icons-png.flaticon.com/512/4588/4588102.png"
					className="invert"
				/>
			</h1>
			<div className="w-full p-2 sm:p-3 mb-2 grid grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
				<div className="p-3 text-white rounded-xl border-2 border-white/[2%] min-h-[45vh] xl:min-h-[65vh] ">
					<div className="flex flex-col gap-2 h-full">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
							<h1 className="flex-1 w-full text-sm sm:text-base font-bold tracking-wider backdrop-blur-[3px] p-2 px-3 rounded-lg flex  items-center gap-2">
								All Your Decks
							</h1>
							<Link
								href={"/decks/add-deck"}
								className="w-full sm:w-auto h-max p-2 px-3 bg-transparent backdrop-blur-[3px] text-xs sm:text-sm rounded-lg border-2 border-white/5 shadow-xl shadow-black/20 hover:scale-105 focus:scale-100 cursor-pointer transition-transform ease-in-out flex items-center justify-center capitalize"
							>
								add / manage decks
								<Ico
									src="https://cdn-icons-png.flaticon.com/512/1237/1237946.png"
									size={15}
									className="invert ml-3"
								/>
							</Link>
						</div>
						<div className="overflow-auto flex-1 max-h-[35vh] sm:max-h-[45vh] xl:max-h-[55vh] flex flex-col gap-2 mt-2">
							{error && (
								<div className="flex items-center justify-center h-full">
									<span className="text-md text-red-400">
										Error: {error}
									</span>
								</div>
							)}
							{decks.length === 0 && !loading && !error && (
								<div className="flex items-center justify-center h-full">
									<span className="text-md text-gray-400">
										No decks found ☹️
									</span>
								</div>
							)}
							{loading && (
								<div className="flex items-center justify-center h-full">
									<LoadingSpinner />
								</div>
							)}
							<AnimatePresence>
								{decks.map((deck, index) => (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.1,
											delay: 0.1 * index,
										}}
										exit={{ opacity: 0, y: -10 }}
										whileTap={{ scale: 0.98 }}
										className="group text-xs sm:text-sm lg:text-base bg-transparent backdrop-blur-[2px] p-2 px-3 w-full hover:w-full rounded-lg border-2 border-white/5 shadow-lg shadow-black/30 cursor-pointer hover:bg-white/5 transition-all ease-in-out flex items-center"
										key={index}
										onClick={(
											e: React.MouseEvent<HTMLDivElement>
										) => {
											e.stopPropagation();
											setActiveDeck(deck);
										}}
									>
										<div className="w-full flex items-center justify-between">
											<div>
												<Ico
													src="https://cdn-icons-png.flaticon.com/512/13751/13751689.png"
													size={16}
													className="mr-3 flex-shrink-0 invert-25 group-hover:invert group-hover:scale-110 transition-transform ease-in-out"
												/>{" "}
												<span className="truncate group-hover:underline group-hover:underline-offset-3">
													{deck.name}
												</span>
											</div>
											<div className="transition-transform ease-in-out group-hover:translate-x-1 mr-2">
												<Ico
													src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
													size={10}
													className="invert"
												/>
											</div>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</div>
				</div>

				<div className="grid grid-rows-4 gap-2 sm:gap-3 lg:gap-4 order-2">
					<div className="rounded-xl text-black flex justify-center row-span-1 items-center p-3 shadow-black/50 min-h-[9vh] sm:min-h-[11vh] xl:min-h-[18vh] border-2 border-white/[2%]">
						<DeckStatus id={activeDeck?.id || null} />
					</div>
					<div className="rounded-xl shadow-black/50 min-h-[18vh] row-span-3 sm:min-h-[22vh] xl:min-h-[28vh] border-2 border-white/[2%]">
						<div className="p-2 h-full flex items-center justify-center">

						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
