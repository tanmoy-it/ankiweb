"use client";
import DeckForm from "./components/DeckForm";
import DeckActions from "./components/DeckActions";
import FieldList from "./components/FieldList";
import DeckList from "./components/DeckList";
import PaginationControls from "./components/PaginationControls";
import { useFields } from "./hooks/useFields";
import { useDecks } from "./hooks/useDecks";
import { usePagination } from "./hooks/usePagination";

export default function AddDeckPageContent({ userId }: { userId: string }) {
	const {
		fields,
		setFields,
		addField,
		removeField,
		changeName,
		moveUp,
		moveDown,
		toggleIsRequired,
		toggleIsQuestionField,
	} = useFields();
	const {
		decks,
		selectedDeckId,
		deckName,
		setDeckName,
		isSubmitting,
		handleSubmit,
		selectDeck,
		handleDelete,
		loadingDecks,
	} = useDecks(userId!, fields, setFields);
	const {
		searchQuery,
		currentPage,
		totalPages,
		setCurrentPage,
		handleSearchChange,
	} = usePagination(decks.length, 8);

	const filteredDecks = decks.filter((deck) =>
		deck.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const paginatedDecks = filteredDecks.slice(
		(currentPage - 1) * 8,
		currentPage * 8
	);

	return (
		<div className="flex gap-6">
			<div className="w-1/2">
				<h1 className="font-bold text-xl">
					{selectedDeckId ? "Edit Deck ✎" : "Add Deck +"}
				</h1>
				<br />
				<DeckForm
					deckName={deckName}
					setDeckName={setDeckName}
					handleSubmit={handleSubmit}
					loading={isSubmitting}
					fields={fields}
					selectedDeckId={selectedDeckId}
				/>
				<div className="flex flex-col gap-2 mt-4">
					<DeckActions addField={addField} />
					<FieldList
						fields={fields}
						toggleIsRequired={toggleIsRequired}
						toggleIsQuestionField={toggleIsQuestionField}
						moveUp={moveUp}
						moveDown={moveDown}
						changeName={changeName}
						removeField={removeField}
					/>
				</div>
			</div>
			<div className="w-1/2 bg-dune-900/[2%] p-3 rounded-xl shadow-lg border-2 border-dune-900/20">
				<h2 className="font-bold text-xl underline underline-offset-8 decoration-dune-500/50 mb-5 text-center">
					Your Decks
				</h2>
				{/* search bar */}
				<input
					type="text"
					placeholder="Search decks..."
					value={searchQuery}
					onChange={handleSearchChange}
					className="mb-2 w-1/3 p-2 rounded-md border-1 border-dune-200/10 outline-none"
				/>
                    <DeckList
                        loadingDecks={loadingDecks}
                        decks={paginatedDecks}
                        selectDeck={selectDeck}
                        handleDelete={handleDelete}
                    />
                    {/* pagination controls */}
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
			</div>
		</div>
	);
}
