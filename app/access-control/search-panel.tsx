"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import Ico from "../util-components/ico";
import { AnimatePresence, motion } from "motion/react";

export default function SearchPanel({
	entities,
	entitiesLoading,
	setActiveEntity,
	label,
	disabled = false,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	entities?: any[];
	entitiesLoading?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setActiveEntity?: any;
	label?: string;
	disabled?: boolean;
}) {
	const [searchQuery, setSearchQuery] = useState("");

	function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchQuery(event.target.value);
	}
	return (
		<div
			className={`flex flex-col gap-1 w-full ${disabled ? " opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
		>
			{label && (
				<h1 className="text-lg text-dune-100/60 tracking-[calc(1.9rem)] uppercase text-center">
					{label}
				</h1>
			)}
			<Input
				type={"text"}
				placeholder={"Search" + (label ? ` ${label}` : "")}
				defaultValue={searchQuery}
				onChange={handleSearchChange}
				className={
					"placeholder:tracking-wider rounded-full border-none shadow-none text-sm text-dune-100/80"
				}
			/>
			{entitiesLoading ? (
				<div className="flex justify-center items-center p-2">
					<Ico
						src="https://cdn-icons-png.flaticon.com/512/10539/10539493.png"
						className="invert animate-spin mr-2"
						size={20}
					/>
					loading ...
				</div>
			) : (
				<div className="w-full flex gap-1 flex-wrap bg-dune-900/30 p-2 rounded-xl overflow-y-auto max-h-full overflow-hidden">
					<AnimatePresence>
						{(!entities || entities.length === 0) && (
							<div className="w-full p-2 bg-dune-900/50 rounded-lg text-sm text-center">
								Nothing Found{" "}
								<Ico
									src="https://cdn-icons-png.flaticon.com/512/12686/12686702.png"
									className="invert ml-2"
									size={20}
								/>
							</div>
						)}
						{entities &&
							entities
								.filter((entity) => {
									if (!searchQuery) return true;
									return entity.name
										.trim()
										.toLowerCase()
										.includes(
											searchQuery.trim().toLowerCase()
										);
								})
								.map((entity, index) => (
									<motion.div
										initial={{
											opacity: 0,
											scale: 0.8,
											rotateX: -15,
											y: 20,
										}}
										animate={{
											opacity: 1,
											scale: 1,
											rotateX: 0,
											y: 0,
										}}
										transition={{
											duration: 0.4,
											ease: "easeInOut",
											delay: index * 0.02,
										}}
										exit={{
											opacity: 0,
											scale: 0.6,
											rotateX: 15,
											y: -10,
											transition: { duration: 0.2 },
										}}
										whileTap={{
											scale: 0.95,
											rotateY: 0,
											transition: { duration: 0.1 },
										}}
										onClick={() => {
											if (setActiveEntity) {
												setActiveEntity(entity);
											}
										}}
										className="w-max max-w-full p-1 bg-dune-900/50 px-2 rounded-lg text-md text-wrap cursor-pointer hover:scale-105 transition-all"
										key={entity.id}
										style={{
											transformStyle: "preserve-3d",
										}}
									>
										{entity.name}
									</motion.div>
								))}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}
