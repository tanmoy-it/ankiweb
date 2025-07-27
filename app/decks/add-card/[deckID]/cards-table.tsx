"use client";

import { CardField, DeckFieldDefinition } from "@/lib/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import {
	DataTable,
	createSortableColumn,
	createActionsColumn,
} from "@/app/comps/DataTable";
import { useMemo, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { deleteCard, fetchCardData, updateCard } from "../../actions/card-actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DynamicCardForm from "./dynamic-card-form";

interface CardsTableProps {
	deckFields: DeckFieldDefinition[];
	// eslint-disable-next-line
	data: any[];
}

interface EditModalState {
	isOpen: boolean;
	cardId: string | null;
	cardData: {
		fields: CardField[];
		deckId: string;
	} | null;
}

export default function CardsTable({ deckFields, data }: CardsTableProps) {
	const [editModal, setEditModal] = useState<EditModalState>({
		isOpen: false,
		cardId: null,
		cardData: null,
	});
	const [isLoading, setIsLoading] = useState(false);
	// eslint-disable-next-line
	const handleEdit = async (card: any) => {
		setIsLoading(true);
		setEditModal(prev => ({
			...prev,
			isOpen: true,
			cardId: card.id,
		}));

		try {
			const response = await fetchCardData(card.id);
			if (response.error) {
				toast.error(response.message);
				closeEditModal();
			} else {
				setEditModal(prev => ({
					...prev,
					cardData: {
						fields: response.data.fields ?? [],
						deckId: response.data.deck.id ?? "",
					},
				}));
			}
		} catch (error: Error | unknown) {
			toast.error(error instanceof Error ? error.message : "Failed to fetch card data");
			closeEditModal();
		} finally {
			setIsLoading(false);
		}
	};

	const closeEditModal = () => {
		setEditModal({
			isOpen: false,
			cardId: null,
			cardData: null,
		});
	};
// eslint-disable-next-line
	const handleDelete = async (card: any) => {
		console.log("Delete card:", card);
		const response  = await deleteCard(card.id);
		if (response.error) {
			toast.error(response.message);
		} else {
			toast.success(response.message);
		}
	};
// eslint-disable-next-line
	const handleView = (card: any) => {
		console.log("might implement later");
	};
// eslint-disable-next-line
	const handleExport = (data: any[]) => {
		console.log("Exporting cards:", data);
		// Convert to CSV
		const csvContent = [
			deckFields.map((field) => field.fieldName),
			...data.map((card) =>
				deckFields.map((field) => card[field.fieldName] || "")
			),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "cards.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
// eslint-disable-next-line
	const handleRowSelectionChange = (selectedCards: any[]) => {
		console.log("might implement later");
	};

	const bulkActions = [
		{
			label: "Delete ",
			icon: <Trash2 className="mr-2 h-4 w-4" />,
			// eslint-disable-next-line
			onClick: (selectedCards: any[]) => {
				console.log("Bulk delete:", selectedCards);
				// Add bulk delete logic here
			},
			variant: "destructive" as const,
		},
		{
			label: "Export ",
			icon: <Eye className="mr-2 h-4 w-4" />,
			// eslint-disable-next-line
			onClick: (selectedCards: any[]) => {
				console.log("Bulk export:", selectedCards);
				handleExport(selectedCards);
			},
			variant: "outline" as const,
		},
	];
	// eslint-disable-next-line
	const columns = useMemo<ColumnDef<any>[]>(() => {
		// eslint-disable-next-line
		const columnsDefs: ColumnDef<any>[] = [];

		deckFields.forEach((field) => {
			if (field.fieldType === "TEXT") {
				columnsDefs.push(
					createSortableColumn(field.fieldName, field.fieldName)
				);
			} else if (field.fieldType === "IMAGE") {
				columnsDefs.push({
					accessorKey: field.fieldName,
					header: () => (
						<span className="capitalize">{field.fieldName}</span>
					),
					cell: (info) => {
						const value = info.getValue();
						return value ? (
							// eslint-disable-next-line
							<img
								src={value as string}
								alt={field.fieldName}
								className="w-16 h-16 object-cover rounded"
							/>
						) : (
							<div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
								<span className="text-xs text-gray-500">
									No image
								</span>
							</div>
						);
					},
					enableSorting: false,
					enableColumnFilter: false,
				});
			} else if (field.fieldType === "AUDIO") {
				columnsDefs.push({
					accessorKey: field.fieldName,
					header: () => (
						<span className="capitalize">{field.fieldName}</span>
					),
					cell: (info) => {
						const value = info.getValue();
						return value ? (
							<audio
								preload="none"
								controls
								src={value as string}
								className="w-24 h-6"
							/>
						) : (
							<div className="w-24 h-6 bg-gray-200 rounded flex items-center justify-center">
								<span className="text-xs text-gray-500">
									No audio
								</span>
							</div>
						);
					},
					enableSorting: false,
					enableColumnFilter: false,
				});
			}
		});

		// Add actions column using helper function
		columnsDefs.push(
			createActionsColumn([
				{
					label: "View",
					icon: <Eye className="mr-2 h-4 w-4" />,
					onClick: handleView,
					variant: "ghost",
				},
				{
					label: "Edit",
					icon: <Edit className="mr-2 h-4 w-4" />,
					onClick: handleEdit,
					variant: "ghost",
				},
				{
					label: "Delete",
					icon: <Trash2 className="mr-2 h-4 w-4" />,
					onClick: handleDelete,
					variant: "destructive",
				},
			])
		);

		return columnsDefs;
	}, [deckFields, handleEdit]);

	return (
		<div className="space-y-4">
			<Dialog open={editModal.isOpen} onOpenChange={(open: boolean) => !open && closeEditModal()}>
				<DialogContent className="sm:max-w-[70%]">
					<DialogHeader className={""}>
						<DialogTitle className={""}>Edit Card</DialogTitle>
						<DialogDescription className={""}>
							Make changes to your card here. Click save when you&apos;re done.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-sm text-gray-500">Loading card data...</div>
							</div>
						) : editModal.cardData ? (
							<DynamicCardForm
								deckID={editModal.cardData.deckId}
								handleModalClose={closeEditModal}
								deckFields={deckFields}
								defaultValues={editModal.cardData.fields}
								serverAction={updateCard}
							/>
						) : null}
					</div>
				</DialogContent>
			</Dialog>
			<h2 className="text-xl font-semibold text-dune-50 underline underline-offset-5 decoration-dune-500/50 w-max bg-linear-to-t from-white/[3%] to-transparent">
				Cards in this Deck
			</h2>
			<DataTable
				columns={columns}
				data={data}
				enableRowSelection={true}
				enableBulkActions={true}
				searchPlaceholder="Search cards..."
				onRowSelectionChange={handleRowSelectionChange}
				onExport={handleExport}
				bulkActions={bulkActions}
				emptyStateMessage="No cards found. Add some cards to get started!"
			/>
		</div>
	);
}
