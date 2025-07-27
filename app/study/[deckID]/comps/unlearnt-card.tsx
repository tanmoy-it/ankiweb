"use client";

import {  DeckFieldDefinition } from "@/lib/generated/prisma";
import { SessionData } from "../types";
import Ico from "@/app/util-components/ico";
import { memo,  useEffect, useMemo, useState } from "react";
import {
	handleBadButtonClick,
	handleGoodButtonClick,
} from "../deck-study-action";
import { toast } from "sonner";
import StudyCardField from "./study-card-field";

function UnlearntCard({
	sessionData,
	unLearntCards,
}: {
	sessionData: SessionData;
	unLearntCards: SessionData["SessionCards"];
}) {
	const [showAnswer, setShowAnswer] = useState(false);

	// Handle space key to toggle answer visibility
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === " ") {
				e.preventDefault();
				setShowAnswer((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	async function handleGood() {
		const response = await handleGoodButtonClick(
			unLearntCards[0].sessionId,
			unLearntCards[0].card.id
		);
		if (response.error) {
			toast.error(response.message);
			return;
		}
		toast.success(response.message);
	}

	async function handleBad() {
		// Handle bad button click
		const response = await handleBadButtonClick(
			unLearntCards[0].sessionId,
			unLearntCards[0].card.id
		);
		if (response.error) {
			toast.error(response.message);
			return;
		}
		toast.success(response.message);
	}

	const cardFields = useMemo(() => {
		return (
			<div className="flex flex-col items-center justify-start min-h-[80dvh] p-4">
				{sessionData.deck.fieldDefinitions.map(
					(field: DeckFieldDefinition) => {
						if (field.isQuestionField) {
							return (
								<StudyCardField
									key={field.id}
									field={field}
									unLearntCard={unLearntCards[0]}
								/>
							);
						} else if (showAnswer) {
							return (
								<StudyCardField
									key={field.id}
									field={field}
									unLearntCard={unLearntCards[0]}
								/>
							);
						}
						return null;
					}
				)}
			</div>
		);
	}, [sessionData, unLearntCards, showAnswer]);

	function formatInterval(tryCount: number, lastInterval?: number): string {
		if (tryCount === 0) return "10 minutes";
		if (tryCount < 1) return "1 minute";

		const intervalInDays = lastInterval ? lastInterval * 1.5 : 1;

		if (intervalInDays < 1) {
			const minutes = Math.round(intervalInDays * 24 * 60);
			return `${minutes} min`;
		}
		if (intervalInDays < 30) {
			return `${Math.round(intervalInDays)} days`;
		}
		if (intervalInDays < 365) {
			return `${Math.round(intervalInDays / 30)} months`;
		}
		return `${Math.round(intervalInDays / 365)} years`;
	}

	return (
		<div className="flex items-center justify-center w-2/3 bg-dune-700/10 rounded-2xl shadow-lg shadow-black/30 border-2 border-dune-500/10 p-4">
			<div className="w-full">
				{cardFields}
				<div className="flex flex-col w-full items-center justify-center bg-dune-700/5 rounded-2xl shadow-xl shadow-black/10 border-2 border-dune-500/10 p-2">
					{/* two buttons for good and bad */}
					<div className="flex items-center justify-between w-full">
						<div className="flex gap-2">
							<button
								onClick={() => handleBad()}
								className="bg-warning-400 text-white p-2 px-4 rounded-lg hover:bg-warning-200 hover:text-warning-800 transition-colors flex items-center gap-2 cursor-pointer group"
							>
								<Ico
									src="https://cdn-icons-png.flaticon.com/128/507/507257.png"
									size={20}
									className="invert group-hover:scale-105 group-hover:-translate-x-1 transition-transform group-hover:invert-0"
								/>
								<span>
									Bad
									<span className="text-sm opacity-70">
										{"(over 5 minutes)"}
									</span>
								</span>{" "}
							</button>
							<div className="flex items-center text-sm">
								Again
							</div>
						</div>

						<div>
							<button
								className="flex items-center gap-2 bg-white/5 p-2 px-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
								onClick={() => {
									setShowAnswer((sa) => !sa);
								}}
							>
								show answer{" "}
								{showAnswer ? (
									<Ico
										src="https://cdn-icons-png.flaticon.com/128/709/709612.png"
										size={20}
										className="invert"
									/>
								) : (
									<Ico
										src="https://cdn-icons-png.flaticon.com/128/2767/2767146.png"
										size={20}
										className="invert"
									/>
								)}
							</button>
						</div>

						<div className="flex gap-2">
							<div className="flex items-center text-sm">
								{formatInterval(
									unLearntCards[0].tryCount,
									unLearntCards[0].card.lastInterval || 1
								)}
							</div>
							<button
								onClick={() => handleGood()}
								className="bg-olivine-400 text-white p-2 px-4 rounded-lg hover:bg-olivine-200 hover:text-olivine-800 transition-colors flex items-center gap-2 cursor-pointer group"
							>
								<span>
									Good
									<span className="text-sm opacity-70">
										{"(under 1 minute)"}
									</span>
								</span>{" "}
								<Ico
									src="https://cdn-icons-png.flaticon.com/128/271/271226.png"
									size={20}
									className="invert group-hover:scale-105 group-hover:translate-x-1 transition-transform group-hover:invert-0"
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(UnlearntCard);
