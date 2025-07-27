"use server";

import {DeckFieldDefinition } from "@/lib/generated/prisma";
import { db } from "@/lib/prisma/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";


// eslint-disable-next-line
export async function addCardAction(prevState: any, cardData: FormData) {
	try {
		const deckID = cardData.get("deckID");
		if (!deckID) {
			return { message: "Deck ID is missing.", error: true };
		}
		const deckFields = await db.deckFieldDefinition.findMany({
			where: {
				deckId: deckID as string,
			},
			orderBy: {
				order: "asc",
			},
		});
		const getValue = async (field: DeckFieldDefinition) => {
			if (field.fieldType === "TEXT") {
                if (cardData.get(field.id) as string === "" && field.isRequired) {
                    throw new Error(
                        `Field "${field.fieldName}" is required but not provided.`
                    );
                }
				return (cardData.get(field.id) as string) || "";
			} else if (
				field.fieldType === "IMAGE" ||
				field.fieldType === "AUDIO"
			) {
				const file = cardData.get(field.id) as File;
				// limit file size to 5MB plus check for file type with mime type
				if (file && file.size > 5 * 1024 * 1024) {
					throw new Error(
						`File for field "${field.fieldName}" exceeds the size limit of 5MB.`
					);
				}
				if (file && !file.type.startsWith("image/") && field.fieldType === "IMAGE") {
					throw new Error(
						`File for field "${field.fieldName}" must be an image.`
					);
				}
				// if file doesn't exist then check if field is required and throw an error
				if (field.isRequired && !file) {
					throw new Error(
						`Field "${field.fieldName}" is required but no file was uploaded.`
					);
				}
				if (file && file.size > 0) {
					const randomFileName = `${Date.now()}-${file.name}`;
					const uploadDir = `./public/uploads/${deckID}`;
					const filePath = `${uploadDir}/${randomFileName}`;

					// Create directory if it doesn't exist
					await fs.mkdir(uploadDir, { recursive: true });

					// Convert file to buffer and save
					const arrayBuffer = await file.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer);
					await fs.writeFile(filePath, buffer);

					return `/uploads/${deckID}/${randomFileName}`; // return web-accessible path
				} else {
					throw new Error(
						`No file uploaded for field "${field.fieldName}"`
					);
				}
			} else {
				console.warn(`Unsupported field type: ${field.fieldType}`);
				return "";
			}
		};

		// create a new card in the database
		const fieldData = await Promise.all(
			deckFields.map(async (field) => ({
				deckFieldDefinitionId: field.id,
				value: (await getValue(field)) ?? "",
			}))
		);

		const totalCards = await db.card.count()

		const newCard = await db.card.create({
			data: {
				deckId: deckID as string,
				orderIndex: totalCards + 1, // Set order index based on total cards
				fields: {
					createMany: {
						data: fieldData,
					},
				},
			},
		});
		if (!newCard) {
			throw new Error("Failed to create new card.");
		}
		revalidatePath(`/decks/add-card/${deckID}`);
		return { message: "Card added successfully.", error: false };
	} catch (error) {
		return {
			message:
				error instanceof Error ? error.message : "Failed to add card.",
			error: true,
		};
	}
}

export async function getAllCards(deckID: string) {
	try {
		const cards = await db.card.findMany({
			where: {
				deckId: deckID,
			},
			include: {
				fields: {
					include: {
						deckFieldDefinition: true,
					},
				}
			},
		});

		// Get field definitions in order
		const fieldDefinitions = await db.deckFieldDefinition.findMany({
			where: {
				deckId: deckID,
			},
			orderBy: {
				order: "asc",
			},
		});

		// Transform cards to flat objects with ordered fields
		const transformedCards = cards.map((card) => {
			// eslint-disable-next-line
			const flatCard: any = {
				id: card.id,
			};

			// Add fields in the same order as field definitions
			fieldDefinitions.forEach((fieldDef) => {
				const field = card.fields.find(
					(f) => f.deckFieldDefinitionId === fieldDef.id
				);
				flatCard[fieldDef.fieldName] = field ? field.value : "";
			});

			// Add deck ID and other metadata
			
			return flatCard;
		});
        return transformedCards;
	} catch (error: Error | unknown) {
        console.error("Error fetching cards:", error);
		return [];
	}
}
// eslint-disable-next-line
export async function fetchCardData(cardID: string): Promise<{error: boolean; data?: any, message?: string}> {
    try {
        const cardWithFields = await db.card.findUnique({
            where: {
                id: cardID
            },
            include: {
                deck: {
                    include: {
                        fieldDefinitions: true
                    }
                },
                fields: true
            },
        })
        if (!cardWithFields) {
            throw new Error("Can't find Card Please Try Again!!!")
        }
        return {error: false, data: cardWithFields}
    } catch (error) {
        return {error: true, message: error instanceof Error ? error.message : "Can't fetch card, please Try again"}
    }
}
// eslint-disable-next-line
export async function updateCard(prevState: any, cardData: FormData): Promise<{ message: string; error: boolean }> {
    try {
        const cardID = cardData.get("cardID") as string;
        const deckID = cardData.get("deckID") as string;
        
        if (!cardID || !deckID) {
            return { message: "Card ID or Deck ID is missing.", error: true };
        }

        // Get field definitions to know which fields to update
        const deckFields = await db.deckFieldDefinition.findMany({
            where: {
                deckId: deckID,
            },
        });

        // Update each field
        for (const field of deckFields) {
            if (field.fieldType === "TEXT") {
                const fieldValue = cardData.get(field.id);
                if (fieldValue !== null) {
                    await db.cardField.upsert({
                        where: {
                            cardId_deckFieldDefinitionId: {
                                cardId: cardID,
                                deckFieldDefinitionId: field.id
                            }
                        },
                        update: {
                            value: fieldValue.toString()
                        },
                        create: {
                            cardId: cardID,
                            deckFieldDefinitionId: field.id,
                            value: fieldValue.toString()
                        }
                    });
                }
            } else if (field.fieldType === "IMAGE" || field.fieldType === "AUDIO") {
                const file = cardData.get(field.id) as File;

                if (file && file.size > 0) { // A new file is uploaded
                    // limit file size to 5MB plus check for file type with mime type
                    if (file.size > 5 * 1024 * 1024) {
                        throw new Error(
                            `File for field "${field.fieldName}" exceeds the size limit of 5MB.`
                        );
                    }
                    if (file && !file.type.startsWith("image/") && field.fieldType === "IMAGE") {
                        throw new Error(
                            `File for field "${field.fieldName}" must be an image.`
                        );
                    }

                    const randomFileName = `${Date.now()}-${file.name}`;
                    const uploadDir = `./public/uploads/${deckID}`;
                    const filePath = `${uploadDir}/${randomFileName}`;

                    // Create directory if it doesn't exist
                    await fs.mkdir(uploadDir, { recursive: true });

                    // Convert file to buffer and save
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await fs.writeFile(filePath, buffer);

                    const newPath = `/uploads/${deckID}/${randomFileName}`;

                    await db.cardField.upsert({
                        where: {
                            cardId_deckFieldDefinitionId: {
                                cardId: cardID,
                                deckFieldDefinitionId: field.id
                            }
                        },
                        update: {
                            value: newPath
                        },
                        create: {
                            cardId: cardID,
                            deckFieldDefinitionId: field.id,
                            value: newPath
                        }
                    });
                }
            }
        }
        revalidatePath(`/decks/add-card/${deckID}`);
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to update card.",
            error: true
        };
    }
    return { message: "Card updated successfully", error: false };
}

export async function deleteCard(cardID: string): Promise<{ message: string; error: boolean }> {
	// return { message: "This function is not implemented yet.", error: true };
	try {
		const card = await db.card.findUnique({
			where: { id: cardID }
		});
		if (!card) {
			return { message: "Card not found.", error: true };
		}

		await db.card.delete({
			where: { id: cardID }
		});

		revalidatePath(`/decks/add-card/${card.deckId}`);
		return { message: "Card deleted successfully.", error: false };
	} catch (error) {
		return {
			message: error instanceof Error ? error.message : "Failed to delete card.",
			error: true
		};
	}
}