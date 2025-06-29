import React, { createContext, useContext, useState } from "react";

const DeckContext = createContext({
	deck: null,
	setDeck: (deck: any) => {},
	resetDeck: () => {},
});

export function DeckProvider({ children}: { children: React.ReactNode }) {
	const [deck, setDeck] = useState(null);

	function resetDeck() {
		setDeck(null);
	}

	return (
		<DeckContext.Provider value={{ deck, setDeck, resetDeck }} >
			{children}
		</DeckContext.Provider>
	);
}

export function useDeck() {
	const context = useContext(DeckContext);
	return {
		...context,
		setDeck: context.setDeck,
		resetDeck: context.resetDeck,
	};
}
