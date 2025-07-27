"use server";

import { db } from "@/lib/prisma/db";
import { revalidatePath } from "next/cache";
import { SessionData } from "./types";

// Helper function to validate inputs
function validateSessionInputs(deckID: string, userID: string) {
	if (!userID) {
		throw new Error("User ID is required to fetch study session.");
	}
	if (!deckID) {
		throw new Error("Deck ID is required to fetch study session.");
	}
}

// Helper function to get today's date consistently
function getTodayStartOfDay(): Date {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}

// Helper function to find existing session
export async function findExistingSession(
	deckID: string,
	userID: string,
	today: Date
) {
	return db.studySession.findFirst({
		where: {
			expiresAt: { gte: today },
			deckId: deckID,
			userId: userID,
		},
		include: {
			deck: {
				include: {
					fieldDefinitions: {
						orderBy: { order: "asc" },
					},
				},
			},
			SessionCards: {
				include: {
					card: {
						include: { fields: true },
					},
				},
				orderBy: { cardOrder: "asc" },
			},
		},
	});
}

// Helper function to prepare session cards
// eslint-disable-next-line
function prepareSessionCards(reviewCards: any[], newCards: any[]) {
	const sessionCards = [
		...reviewCards.map((card, index) => ({
			cardId: card.id,
			cardOrder: index,
			islearnt: false,
			isReviewCard: true,
		})),
		...newCards.map((card, index) => ({
			cardId: card.id,
			cardOrder: index + reviewCards.length,
			islearnt: false,
			isReviewCard: false,
		})),
	];

	// Shuffle cards
	for (let i = sessionCards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[sessionCards[i], sessionCards[j]] = [sessionCards[j], sessionCards[i]];
	}

	// Re-assign order after shuffling
	sessionCards.forEach((card, index) => {
		card.cardOrder = index;
	});

	return sessionCards;
}

// Helper function to create new session with cards
async function createSessionWithCards(
	deckID: string,
	userID: string,
	// eslint-disable-next-line
	sessionCards: any[],
	today: Date
) {
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const newSession = await db.studySession.create({
		data: {
			expiresAt: tomorrow,
			deckId: deckID,
			userId: userID,
		},
	});

	const createdSessionCards = await db.sessionCards.createMany({
		data: sessionCards.map((card) => ({
			sessionId: newSession.id,
			cardId: card.cardId,
			cardOrder: card.cardOrder,
			islearnt: card.islearnt,
			isReviewCard: card.isReviewCard,
		})),
	});

	if (createdSessionCards.count === 0) {
		throw new Error("Failed to create session cards.");
	}

	return newSession.id;
}

// Helper function to fetch complete session
async function fetchCompleteSession(sessionId: string) {
	const session = await db.studySession.findUnique({
		where: { id: sessionId },
		include: {
			deck: {
				include: {
					fieldDefinitions: {
						orderBy: { order: "asc" },
					},
				},
			},
			SessionCards: {
				include: {
					card: {
						include: { fields: true },
					},
				},
				orderBy: { cardOrder: "asc" },
			},
		},
	});

	if (!session) {
		throw new Error("Failed to fetch study session.");
	}

	return session;
}

// Common function to reorder cards (extracted from both button handlers)
async function reorderCardToEnd(
	sessionId: string,
	cardId: string,
	updates: { tryCount?: number; islearnt?: boolean }
) {
	return db.$transaction(async (tx) => {
		const sessionCards = await tx.sessionCards.findMany({
			where: { sessionId },
			orderBy: { cardOrder: "asc" },
		});

		if (sessionCards.length === 0) {
			throw new Error("No session cards found.");
		}

		const currentCard = sessionCards.find((c) => c.cardId === cardId);
		if (!currentCard) {
			throw new Error("Card not found in session.");
		}

		// Shift higher-order cards down
		const cardsToShift = sessionCards.filter(
			(c) => c.cardOrder > currentCard.cardOrder
		);
		for (const card of cardsToShift) {
			await tx.sessionCards.update({
				where: { id: card.id },
				data: { cardOrder: card.cardOrder - 1 },
			});
		}

		// Move current card to end with updates
		const maxOrder = Math.max(...sessionCards.map((c) => c.cardOrder));
		await tx.sessionCards.update({
			where: {
				sessionId_cardId: { sessionId, cardId },
			},
			data: {
				cardOrder: maxOrder,
				...updates,
			},
		});
	});
}

// Helper function to update card review schedule
async function updateCardReviewSchedule(cardId: string) {
	const originalCard = await db.card.findUnique({
		where: { id: cardId },
	});

	if (!originalCard) {
		throw new Error("Card not found.");
	}

	const lastInterval = originalCard.lastInterval || 1;
	const previousReviewDate = originalCard.nextReviewAt || new Date();
	const increasedLastInterval = lastInterval * 1.5;
	const nextReviewDate = new Date(
		previousReviewDate.getTime() +
			increasedLastInterval * 24 * 60 * 60 * 1000
	);

	await db.card.update({
		where: { id: originalCard.id },
		data: {
			nextReviewAt: nextReviewDate,
			lastInterval: increasedLastInterval,
		},
	});
}

export async function getSessionForDeck(
	deckID: string,
	userID: string
): Promise<SessionData | Error> {
	try {
		validateSessionInputs(deckID, userID);

		const today = getTodayStartOfDay();

		// Check for existing session
		const existingSession = await findExistingSession(
			deckID,
			userID,
			today
		);
		if (existingSession) {
			return existingSession;
		}
		// Get deck with settings and cards
		const deck = await db.deck.findUnique({
			where: { id: deckID, userId: userID },
			include: {
				settings: {
					select: { cardPerDay: true, maxReviewCards: true },
				},
				cards: {
					where: {
						OR: [
							{ nextReviewAt: { lte: today } },
							{ nextReviewAt: null },
						],
					},
					orderBy: [{ nextReviewAt: "asc" }, { createdAt: "asc" }],
				},
			},
		});

		if (!deck) {
			throw new Error(
				"Deck not found or you do not have permission to access it."
			);
		}

		// Filter cards
		const reviewCards = deck.cards
			.filter((card) => card.nextReviewAt && card.nextReviewAt <= today)
			.slice(0, deck.settings?.maxReviewCards || 0);

		const newCards = deck.cards
			.filter((card) => !card.nextReviewAt)
			.slice(0, deck.settings?.cardPerDay || 0);

		if (reviewCards.length === 0 && newCards.length === 0) {
			throw new Error(
				"No cards available for review or learning, You can add new cards to the deck."
			);
		}
		// Create session
		const sessionCards = prepareSessionCards(reviewCards, newCards);
		const sessionId = await createSessionWithCards(
			deckID,
			userID,
			sessionCards,
			today
		);
		return await fetchCompleteSession(sessionId);
	} catch (error: Error | unknown) {
		return error as Error;
	}
}

export async function handleBadButtonClick(
	sessionId: string,
	cardId: string
): Promise<{ error: boolean; message: string }> {
	try {
		const session = await db.studySession.findUnique({
			where: { id: sessionId },
			include: { deck: { select: { id: true } } },
		});

		if (!session) {
			throw new Error("Session not found.");
		}

		await reorderCardToEnd(sessionId, cardId, { tryCount: 0 });

		revalidatePath(`/study/${session.deck.id}`);
		return {
			error: false,
			message: "Card marked as bad and moved to the end.",
		};
	} catch (error) {
		console.error(
			"Error handling bad button click:",
			(error as Error).message
		);
		return { error: true, message: (error as Error).message };
	}
}

async function checkAndMarkSessionAsCompleted(sessionId: string) {
	const ifUnlearntCards = await db.sessionCards.findMany({
		where: { sessionId, islearnt: false },
	});
	if (ifUnlearntCards.length === 0) {
		await db.studySession.update({
			where: { id: sessionId },
			data: { isCompleted: true },
		});
	}
	return true;
}


export async function handleGoodButtonClick(
	sessionId: string,
	cardId: string
): Promise<{ error: boolean; message: string }> {
	try {
		const session = await db.studySession.findUnique({
			where: { id: sessionId },
			include: { deck: { select: { id: true } } },
		});

		if (!session) {
			throw new Error("Session not found.");
		}

		const card = await db.sessionCards.findUnique({
			where: {
				sessionId_cardId: { sessionId, cardId },
			},
		});

		if (!card) {
			throw new Error("Card not found in the session.");
		}

		const newTryCount = (card.tryCount || 0) + 1;

		if (newTryCount >= 2) {
			// Mark as learnt and update review schedule
			await reorderCardToEnd(sessionId, cardId, { islearnt: true });

			try {
				await updateCardReviewSchedule(card.cardId);
			} catch (error) {
				console.error(
					"Error updating card review date:",
					(error as Error).message
				);
			}
			await checkAndMarkSessionAsCompleted(sessionId);
			revalidatePath(`/study/${session.deck.id}`);
			return {
				error: false,
				message: "Card marked as learnt and review date updated.",
			};
		} else {
			// Move to end with updated try count
			await reorderCardToEnd(sessionId, cardId, {
				tryCount: newTryCount,
			});

			revalidatePath(`/study/${session.deck.id}`);
			return {
				error: false,
				message: "Card marked as good and moved to the end.",
			};
		}
	} catch (error) {
		console.error(
			"Error handling good button click:",
			(error as Error).message
		);
		return { error: true, message: (error as Error).message };
	}
}
