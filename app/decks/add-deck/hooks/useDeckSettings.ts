import { DeckSettings } from "@/lib/generated/prisma";
import { useActionState, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	getDeckSettings,
	updateDeckSettings,
} from "../../actions/deck-actions";

export function useDeckSettings(deckID?: string) {
	const [settings, setSettings] = useState<DeckSettings | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [state, formAction, isPending] = useActionState(
		updateDeckSettings,
		null
	);

	useEffect(() => {
		const fetchSettings = async () => {
			if (!deckID) {
				setSettings(null);
				return;
			}
			setLoading(true);
			try {
				const response = await getDeckSettings(deckID);
				if (response.error) {
					toast.error(
						response.message || "Failed to fetch deck settings."
					);
				} else {
					setSettings(response.data);
				}
			} catch (error: Error | unknown) {
				toast.error((error as Error).message || "An error occurred while fetching deck settings.");
			} finally {
				setLoading(false);
			}
		};

		fetchSettings();
	}, [deckID]);

	const handleSettingChange = useCallback(
		// eslint-disable-next-line
		(key: keyof DeckSettings, value: any) => {
			setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
		},
		[]
	);

	return {
		settings,
		loading,
		state,
		formAction,
		isPending,
		handleSettingChange,
	};
}
