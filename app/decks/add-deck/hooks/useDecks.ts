'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    addDeckAction,
    getDecksAction,
    updateDeckAction,
    deleteDeckAction,
} from '../../actions/deck-actions';
import { Deck, fieldType } from '../types';

export function useDecks(userId: string, fields: fieldType[], setFields: (fields: fieldType[]) => void) {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loadingDecks, setLoadingDecks] = useState<boolean>(true);
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
    const [deckName, setDeckName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        setLoadingDecks(true);
        getDecksAction(userId).then((d) => {
            setDecks(d);
            setLoadingDecks(false);
        }).catch((error) => {
            toast.error("Failed to load decks: " + error.message);
        });
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fields.length <= 0) {
            toast.warning("Please add at least one field to the deck.");
            return;
        }
        if (fields.some((field) => field.name.includes("FieldName"))) {
            toast.warning("Please change the default field names before submitting.");
            return;
        }
        setIsSubmitting(true);
        let response;
        if (selectedDeckId) {
            response = await updateDeckAction(selectedDeckId, deckName, fields);
        } else {
            response = await addDeckAction(deckName, fields, userId);
        }
        if (response.success) {
            toast.success(response.message);
            setSelectedDeckId(null);
            setDeckName("");
            setFields([]);
            getDecksAction(userId).then((d) => setDecks(d));
        } else {
            toast.error(response.message);
        }
        setIsSubmitting(false);
    };

    const selectDeck = (deck: Deck) => {
        setSelectedDeckId(deck.id);
        setDeckName(deck.name);
        setFields(
            deck.fieldDefinitions
            // eslint-disable-next-line
                .sort((a, b) => (a as any).order - (b as any).order)
                .map((fd) => ({
                    id: fd.id,
                    name: fd.fieldName,
                    type: fd.fieldType,
                    isRequired: fd.isRequired,
                    isQuestionField: fd.isQuestionField || false,
                }))
        );
    };

    const handleDelete = async (id: string) => {
        setIsSubmitting(true);
        const res = await deleteDeckAction(id);
        if (res.success) {
            toast.success(res.message);
            if (selectedDeckId === id) {
                setSelectedDeckId(null);
                setDeckName("");
                setFields([]);
            }
            getDecksAction(userId).then((d) => setDecks(d));
        } else {
            toast.error(res.message);
        }
        setIsSubmitting(false);
    };

    return {
        decks,
        selectedDeckId,
        deckName,
        setDeckName,
        isSubmitting,
        handleSubmit,
        selectDeck,
        handleDelete,
        loadingDecks,
    };
}
