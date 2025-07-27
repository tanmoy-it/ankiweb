import Ico from "@/app/util-components/ico";
import { CardField, DeckFieldDefinition } from "@/lib/generated/prisma";
import { memo, useCallback } from "react";
import { SessionData } from "../types";

function StudyCardField({
	field,
	unLearntCard,
}: {
	field: DeckFieldDefinition;
	unLearntCard: SessionData["SessionCards"][number];
}) {
	const textIcon = "https://cdn-icons-png.flaticon.com/512/3721/3721901.png";
	const imageIcon = "https://cdn-icons-png.flaticon.com/512/6499/6499530.png";
	const audioIcon = "https://cdn-icons-png.flaticon.com/512/59/59284.png";

	const getValueFields = useCallback(
		(
			fieldDefinition: DeckFieldDefinition,
			card: SessionData["SessionCards"][number]
		) => {
			const value = card.card.fields.find(
				(f: CardField) => f.deckFieldDefinitionId === fieldDefinition.id
			)?.value;
			if (!value) {
				return (
					<p className="text-white/40 line-through">No value found</p>
				);
			}
			if (fieldDefinition.fieldType === "TEXT") {
				return <p className="text-white/90">{value}</p>;
			} else if (fieldDefinition.fieldType === "IMAGE") {
				return (
					<img
						src={value}
						alt={fieldDefinition.fieldName}
						className="max-w-full max-h-60 object-cover rounded-lg"
					/>
				);
			} else if (fieldDefinition.fieldType === "AUDIO") {
				return (
					<audio controls className="w-full">
						<source src={value} type="audio/mpeg" />
						Your browser does not support the audio element.
					</audio>
				);
			}
			return <p className="text-white/90">Unsupported field type</p>;
		},
		[]
	);

	return (
		<div
			className={`flex hover:scale-[101%] flex-col gap-2 items-center mb-3 ${field.isQuestionField ? "bg-white/[1%]" : "bg-lime-300/[5%]"} border-2 border-white/[2%] shadow-md shadow-black/20 px-4 py-2 rounded-xl`}
			key={field.id}
		>
			<h2 className="text-white/60 capitalize flex items-center gap-2 select-none">
				{field.fieldName}{" "}
				<Ico
					src={
						field.fieldType === "TEXT"
							? textIcon
							: field.fieldType === "IMAGE"
								? imageIcon
								: audioIcon
					}
					size={13}
					className="invert-50"
				/>
			</h2>
			<div>{getValueFields(field, unLearntCard)}</div>
		</div>
	);
}

export default memo(StudyCardField);
