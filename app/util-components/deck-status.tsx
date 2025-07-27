"use client";

import { useEffect, useState } from "react";
import Ico from "./ico";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import LoadingSpinner from "./loading-spinner";
import { getDeckStatus } from "../decks/actions/deck-actions";

type DeckStatusData = {
	newCardsCount: number;
	islearntCardsCount: number;
	reviewCardsCount: number;
	hasSession: boolean;
};



export default function DeckStatus({ id }: { id: string | null }) {
	const [deckStatus, setDeckStatus] = useState<DeckStatusData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) {
			setDeckStatus(null);
			setError(null);
			setLoading(false);
			return;
		}

		const fetchDeckStatus = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await getDeckStatus(id);
				
				if (response.error) {
					setError(response.message || "Failed to fetch deck status");
					setDeckStatus(null);
					return;
				}
				setDeckStatus(response.data as DeckStatusData);
			} catch (error) {
				const errorMessage = (error as Error).message || "An unexpected error occurred";
				setError(errorMessage);
				setDeckStatus(null);
			} finally {
				setLoading(false);
			}
		};

		fetchDeckStatus();
	}, [id]);

	const AnimatedContainer = ({ children }: { children: React.ReactNode }) => (
		<AnimatePresence mode="wait">
			<motion.div
				key={id || "no-deck"}
				animate={{ opacity: 1, scale: 1 }}
				initial={{ opacity: 0, scale: 0.9 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.2 }}
				className="flex flex-col items-center justify-center h-full"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);

	if (loading) {
		return (
			<AnimatedContainer>
				<div className="text-white flex flex-col items-center gap-3">
					<LoadingSpinner size={24} />
					<span className="text-sm text-gray-400">Loading deck status...</span>
				</div>
			</AnimatedContainer>
		);
	}

	if (!id) {
		return (
			<AnimatedContainer>
				<div className="text-white text-center">
					<div className="text-lg flex items-center justify-center gap-2">
						Please select a deck
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/3917/3917607.png"
							className="invert"
							size={20}
						/>
					</div>
				</div>
			</AnimatedContainer>
		);
	}

	if (error) {
		return (
			<AnimatedContainer>
				<div className="text-white text-center">
					<div className="text-red-400 text-sm mb-2 flex items-center justify-center gap-2">
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/753/753345.png"
							className="invert"
							size={16}
						/>
						{error}
					</div>
					<button
						onClick={() => {
							setError(null);
							// Trigger re-fetch by updating the key
							const event = new CustomEvent('refetch-deck-status');
							window.dispatchEvent(event);
						}}
						className="text-xs text-blue-400 hover:text-blue-300 underline"
					>
						Try again
					</button>
				</div>
			</AnimatedContainer>
		);
	}

	if (!deckStatus?.hasSession) {
		return (
			<AnimatedContainer>
				<div className="text-white text-center space-y-2">
					<div className="text-lg flex items-center justify-center gap-2">
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/11005/11005402.png"
							size={24}
						/>
						No active study session
					</div>
					<p className="text-sm text-gray-400">
						Start a new study session to begin learning
					</p>
					<Link href={`/study/${id}`}>
						<button className="bg-warning-300 text-warning-950 px-4 py-2 rounded-lg hover:bg-olivine-400 hover:text-olivine-50 cursor-pointer hover:shadow-md hover:shadow-black/30 hover:scale-105 transition-all">
							Start Studying
						</button>
					</Link>
				</div>
			</AnimatedContainer>
		);
	}

	const totalCards = deckStatus.newCardsCount + deckStatus.islearntCardsCount + deckStatus.reviewCardsCount;
	const hasCardsToStudy = deckStatus.newCardsCount > 0 || deckStatus.reviewCardsCount > 0;

	return (
		<AnimatedContainer>
			<div className="text-white text-center space-y-4">
				<div className="flex items-center justify-center gap-4 text-sm">
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 bg-olivine-500 rounded-full"></div>
						<span className="text-olivine-400">New: {deckStatus.newCardsCount}</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 bg-warning-500 rounded-full"></div>
						<span className="text-warning-400">Learnt: {deckStatus.islearntCardsCount}</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 bg-dune-400 rounded-full"></div>
						<span className="text-dune-300">Review: {deckStatus.reviewCardsCount}</span>
					</div>
				</div>
				
				{totalCards === 0 ? (
					<div className="text-gray-400 text-sm">
						No cards in this session
					</div>
				) : (
					<div className="text-xs text-gray-500">
						Total cards: {totalCards}
					</div>
				)}

				<Link href={`/study/${id}`}>
					<button className="bg-warning-300 text-warning-950 px-4 py-2 rounded-lg hover:bg-olivine-400 hover:text-olivine-50 cursor-pointer hover:shadow-md hover:shadow-black/30 hover:scale-105 transition-all">
						{hasCardsToStudy ? 'Continue Studying' : 'Review Complete'}
					</button>
				</Link>
			</div>
		</AnimatedContainer>
	);
}