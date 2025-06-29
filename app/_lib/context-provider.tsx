"use client";

import { DeckProvider } from "./contexts/deck-context";

export function ContextProvider({ children }: { children: React.ReactNode }) {
	return <DeckProvider>{children}</DeckProvider>;
}
