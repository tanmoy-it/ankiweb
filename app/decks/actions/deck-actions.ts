"use server";

import { db } from "@/lib/prisma/db";
import { fieldType } from "../add-deck/types";
import { DeckSettings } from "@/lib/generated/prisma";

export const addDeckAction = async (
	deckName: string,
	fields: fieldType[],
	userId: string
	// eslint-disable-next-line
): Promise<{ success: boolean; message: string; data?: any }> => {
	try {
		if (fields.length <= 0) {
			throw new Error("Please add at least one field to the deck.");
		}
		if (fields.length > 10) {
			throw new Error("A deck cannot have more than 10 fields.");
		}
		// Check for duplicate field names
		const fieldNames = fields.map((field) =>
			field.name.trim().toLowerCase()
		);
		const duplicateNames = fieldNames.filter(
			(name, index) => fieldNames.indexOf(name) !== index
		);
		if (duplicateNames.length > 0) {
			throw new Error("Field names must be unique within a deck.");
		}
		const newDeck = await db.deck.create({
			data: {
				userId: userId,
				name: deckName,
				fieldDefinitions: {
					create: fields.map((field, index) => ({
						id: field.id,
						fieldName: field.name,
						fieldType: field.type,
						isRequired: field.isRequired || false,
						isQuestionField: field.isQuestionField || false,
						order: index,
					})),
				},
			},
		});

		await db.deckSettings.create({
			data: {
				deckId: newDeck.id,
			}
		})

		return {
			success: true,
			message: "Deck created successfully.",
			data: { deckName, fields },
		};
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, message: error.message };
		}
		return { success: false, message: "An unexpected error occurred." };
	}
};

export const getDecksAction = async (userID: string) => {
	return await db.deck.findMany({
		where: {
			userId: userID,
		},
		include: { fieldDefinitions: { orderBy: { order: "asc" } } },
	});
};

export const updateDeckAction = async (
	deckId: string,
	deckName: string,
	fields: fieldType[]
): Promise<{ success: boolean; message: string }> => {
	try {
		console.log("fields", fields);

		if (fields.length <= 0) {
			throw new Error("Please add at least one field to the deck.");
		}

		if (fields.length > 10) {
			throw new Error("A deck cannot have more than 10 fields.");
		}

		// Check for duplicate field names
		const fieldNames = fields.map((field) =>
			field.name.trim().toLowerCase()
		);
		const duplicateNames = fieldNames.filter(
			(name, index) => fieldNames.indexOf(name) !== index
		);
		if (duplicateNames.length > 0) {
			throw new Error("Field names must be unique within a deck.");
		}

		// Get existing field definitions
		const existingDeck = await db.deck.findUnique({
			where: { id: deckId },
			include: { fieldDefinitions: true },
		});

		if (!existingDeck) {
			throw new Error("Deck not found.");
		}

		// Use transaction to ensure atomicity
		await db.$transaction(async (tx) => {
			// Update the deck name
			await tx.deck.update({
				where: { id: deckId },
				data: {
					name: deckName,
				},
			});

			// Get current field IDs
			const currentFieldIds = fields.map((field) => field.id);

			// Delete orphaned field definitions
			await tx.deckFieldDefinition.deleteMany({
				where: {
					deckId: deckId,
					id: {
						notIn: currentFieldIds,
					},
				},
			});

			// Update/create field definitions
			await Promise.all(
				fields.map(async (field, index) => {
					await tx.deckFieldDefinition.upsert({
						where: { id: field.id },
						update: {
							fieldName: field.name,
							fieldType: field.type,
							isRequired: field.isRequired || false,
							isQuestionField: field.isQuestionField || false,
							order: index,
						},
						create: {
							id: field.id,
							fieldName: field.name,
							fieldType: field.type,
							isRequired: field.isRequired || false,
							isQuestionField: field.isQuestionField || false,
							order: index,
							deckId: deckId,
						},
					});
				})
			);
		});

		return { success: true, message: "Deck updated successfully." };
	} catch (error) {
		if (error instanceof Error)
			return { success: false, message: error.message };
		return { success: false, message: "An unexpected error occurred." };
	}
};

export const deleteDeckAction = async (
	deckId: string
): Promise<{ success: boolean; message: string }> => {
	try {
		await db.deck.delete({ where: { id: deckId } });
		return { success: true, message: "Deck deleted successfully." };
	} catch (error) {
		if (error instanceof Error)
			return { success: false, message: error.message };
		return { success: false, message: "An unexpected error occurred." };
	}
};

// settings actions
// eslint-disable-next-line
export const getDeckSettings = async (deckId: string): Promise<{ error: boolean; data?: any; message?: string }> => {
	try {
		const settings = await db.deckSettings.findUnique({
			where: { deckId },
		});
		return { error: false, data: settings };
	} catch (error) {
		if (error instanceof Error) {
			return { error: true, message: error.message };
		}
		return { error: true, message: "An unexpected error occurred." };
	}
};

export const updateDeckSettings = async (
	// eslint-disable-next-line
	prevState: any,
	settingsData: DeckSettings
): Promise<{ error: boolean; message?: string }> => {
	try {
		const updatedSettings = await db.deckSettings.update({
			where: {
				deckId: settingsData.deckId
			},
			data: settingsData
		});
		if (!updatedSettings) {
			throw new Error("Failed to update deck settings.");
		}
		return { error: false, message: "Deck settings updated successfully." };
	} catch (error) {
		if (error instanceof Error) {
			return { error: true, message: error.message };
		}
		return { error: true, message: "An unexpected error occurred." };
	}
};

export const getDeckStatus = async (deckId: string) => {
	try {
		const deck = await db.deck.findUnique({
			where: { id: deckId },
		});
		
		if (!deck) {
			return { error: true, message: "Deck not found." };
		}

		const studySession = await db.studySession.findFirst({
			where: { 
				deckId: deck.id, 
				expiresAt: { gte: new Date() }, 
				isCompleted: false 
			},
			orderBy: { createdAt: "desc" },
		});

		if (!studySession) {
			return { 
				error: false, 
				data: { 
					newCardsCount: 0, 
					islearntCardsCount: 0, 
					reviewCardsCount: 0,
					hasSession: false 
				} 
			};
		}

		const sessionCards = await db.sessionCards.findMany({
			where: {
				sessionId: studySession.id
			}
		});

		const reviewCardsCount = sessionCards.filter(card => card.isReviewCard && !card.islearnt).length;
		const newCardsCount = sessionCards.filter(card => !card.isReviewCard && !card.islearnt).length;
		const islearntCardsCount = sessionCards.filter(card => card.islearnt).length;

		return { 
			error: false, 
			data: { 
				newCardsCount, 
				islearntCardsCount, 
				reviewCardsCount,
				hasSession: true 
			} 
		};
	} catch (error) {
		return { 
			error: true, 
			message: (error as Error).message || "Failed to fetch deck status." 
		};
	}
};