"use client";
import { ReactNode } from "react";
import { fieldType } from "./types";
import Ico from "@/app/util-components/ico";

export default function DeckField({
	field,
	indx,
	toggleRequired,
	toggleIsQuestionField,
	moveUp,
	moveDown,
	changeName,
	removeField,
}: {
	field: fieldType;
	indx: number;
	toggleRequired: (idx: number) => void;
	toggleIsQuestionField: (idx: number) => void;
	moveUp: (idx: number) => void;
	moveDown: (idx: number) => void;
	changeName: (idx: number, newName: string) => void;
	removeField: (idx: number) => void;
	children?: ReactNode;
}) {
	const textIcon = "https://cdn-icons-png.flaticon.com/512/3721/3721901.png";
	const imageIcon = "https://cdn-icons-png.flaticon.com/512/6499/6499530.png";
	const audioIcon = "https://cdn-icons-png.flaticon.com/512/59/59284.png";
	return (
		<div className="flex items-center justify-between p-2 bg-dune-900/10 backdrop-blur-sm rounded-lg border-1 border-dune-900/60 shadow-lg shadow-black/30 hover:shadow-lg hover:bg-dune-850/80 transition-all">
			<div className="flex items-center gap-4 flex-1">
				<div className="flex gap-3 items-center">
					<Ico
						src={
							field.type === "TEXT"
								? textIcon
								: field.type === "IMAGE"
									? imageIcon
									: audioIcon
						}
						size={15}
						className="invert"
					/>
					<input
						type="text"
						value={field.name}
						onChange={(e) => changeName(indx, e.target.value)}
						className="text-sm font-medium text-dune-50 min-w-0 flex-1 bg-transparent border-none outline-none focus:ring-0"
					/>
				</div>
				<div className="flex items-center gap-2 bg-dune-950/30 backdrop-blur-sm rounded-md px-3 py-2">
					<div
						className="relative cursor-pointer"
						onClick={() => toggleRequired(indx)}
					>
						<input
							type="checkbox"
							checked={field.isRequired}
							className="sr-only"
							onChange={() => {}}
						/>
						<div
							className={`w-4 h-4 rounded border-2 select-none transition-colors flex items-center justify-center ${field.isRequired ? "bg-white border-white/80" : "bg-transparent border-dune-600"}`}
						>
							{field.isRequired && (
								<Ico
									src="https://cdn-icons-png.flaticon.com/512/1055/1055183.png"
									size={10}
									className=""
								/>
							)}
						</div>
					</div>
					<span className="text-xs text-dune-400">
						Is Required ?
					</span>
				</div>
				<div className="flex items-center gap-2 bg-dune-950/30 backdrop-blur-sm rounded-md px-3 py-2">
					<div
						className="relative cursor-pointer"
						onClick={() => toggleIsQuestionField(indx)}
					>
						<input
							type="checkbox"
							checked={field.isQuestionField}
							className="sr-only"
							onChange={() => {}}
						/>
						<div
							className={`w-4 h-4 rounded border-2 select-none transition-colors flex items-center justify-center ${field.isQuestionField ? "bg-white border-white/80" : "bg-transparent border-dune-600"}`}
						>
							{field.isQuestionField && (
								<Ico
									src="https://cdn-icons-png.flaticon.com/512/1055/1055183.png"
									size={10}
									className=""
								/>
							)}
						</div>
					</div>
					<span className="text-xs text-dune-400">
						Is Question Field ?
					</span>
				</div>
				<div className="px-2 py-0.5 bg-dune-800/60 rounded text-xs font-medium text-dune-200 mr-2">
					{field.type}
				</div>
			</div>
			<div className="flex items-center gap-2 mr-4">
				<button
					className="p-0.5 hover:bg-dune-800 rounded transition-colors"
					onClick={(e) => {
						e.preventDefault();
						removeField(indx);
					}}
				>
					<svg
						className="w-3 h-3 text-dune-500 hover:text-dune-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<div className="flex flex-col gap-0.5">
				<button

					className="p-0.5 hover:bg-dune-800 rounded transition-colors"
					onClick={(e) => {
						e.preventDefault();
						moveUp(indx);
					}}
				>
					<svg
						className="w-3 h-3 text-dune-500 hover:text-dune-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 15l7-7 7 7"
						/>
					</svg>
				</button>
				<button
					className="p-0.5 hover:bg-dune-800 rounded transition-colors"
					onClick={(e) => {
						e.preventDefault();
						moveDown(indx);
					}}
				>
					<svg
						className="w-3 h-3 text-dune-500 hover:text-dune-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
