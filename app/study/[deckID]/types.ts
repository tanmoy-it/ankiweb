import {
	Card,
	CardField,
	Deck,
	DeckFieldDefinition,
	SessionCards,
	StudySession,
} from "@/lib/generated/prisma";

export interface SessionData extends StudySession {
	deck: Deck & {
		fieldDefinitions: DeckFieldDefinition[];
	};
	SessionCards: (SessionCards & {
		card: Card & {
			fields: CardField[];
		};
	})[];
}
