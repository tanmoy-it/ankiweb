'use client';
import { Button } from "@/components/ui/button";
import Ico from "@/app/util-components/ico";

interface DeckFormProps {
    deckName: string;
    setDeckName: (name: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    // eslint-disable-next-line
    fields: any[];
    selectedDeckId: string | null;
}

export default function DeckForm({ deckName, setDeckName, handleSubmit, loading, fields, selectedDeckId }: DeckFormProps) {
    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-5 gap-3 items-center">
                <input
                    className="col-span-4 p-2 px-3 rounded-md border-2 border-dune-200/10 outline-none focus-within:border-2 focus-within:border-dune-500/50"
                    type="text"
                    placeholder="Deck Name"
                    value={deckName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeckName(e.target.value)}
                    required
                />
                <Button
                    size={"lg"}
                    variant={"default"}
                    className="col-span-1 cursor-pointer"
                    type="submit"
                    disabled={loading || deckName.trim() === "" || fields.length <= 0}
                >
                    {loading ? (
                        <span className="flex justify-center items-center">
                            <Ico
                                src="https://cdn-icons-png.flaticon.com/512/10933/10933699.png"
                                size={15}
                                className="animate-spin mr-3"
                            />
                            Loading ...
                        </span>
                    ) : selectedDeckId ? (
                        "Update Deck"
                    ) : (
                        "Create Deck"
                    )}
                </Button>
            </div>
        </form>
    );
}
