"use client";
import Ico from "@/app/util-components/ico";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardField, DeckFieldDefinition } from "@/lib/generated/prisma/wasm";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";

type FormState = {
	message: string;
	error: boolean;
} | null;

export default function DynamicCardForm({
	deckID,
	handleModalClose,
	deckFields,
	defaultValues,
	serverAction,
}: {
	deckID: string;
	handleModalClose?: (open: boolean) => void;
	deckFields: DeckFieldDefinition[];
	defaultValues?: CardField[];
	// eslint-disable-next-line
	serverAction: (prevState: any, cardData: FormData) => Promise<FormState>;
}) {
	const [state, formAction, isPending] = useActionState(serverAction, null);
	const formRef = useRef<HTMLFormElement>(null);

	// Add useEffect to reset form only on success
	useEffect(() => {
		if (state && !state.error && !defaultValues) {
			formRef.current?.reset();
		}
		if (state && !state.error && handleModalClose) {
			handleModalClose(false);
		}
	}, [state, defaultValues]);

	const textIcon = "https://cdn-icons-png.flaticon.com/512/3721/3721901.png";
	const imageIcon = "https://cdn-icons-png.flaticon.com/512/6499/6499530.png";
	const audioIcon = "https://cdn-icons-png.flaticon.com/512/59/59284.png";

	return (
		<>
			{state && (
				<AnimatePresence mode="wait">
					<motion.p
						animate={{ opacity: 1, y: 0, scale: 1 }}
						initial={{ opacity: 0, y: -20, scale: 0.95 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={`text-center p-5 py-3 mb-4 mx-auto rounded-md ${
							state.error
								? "bg-red-500/10 text-red-100 border-1 border-red-100/20"
								: "bg-green-500/10 text-green-100 border-1 border-green-100/20"
						}`}
					>
						{state.message}
					</motion.p>
				</AnimatePresence>
			)}
			<motion.form
				ref={formRef}
				action={formAction}
				key={state?.error === false ? Date.now() : "preserve-form"}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="bg-linear-to-t/srgb from-dune-300/[2%] to-transparent p-4 rounded-lg shadow-md backdrop-blur-sm border-1 border-dune-700/50"
			>
				<input type="hidden" name="deckID" defaultValue={deckID} />
				<input
					type="hidden"
					name="cardID"
					defaultValue={defaultValues?.[0]?.cardId}
				/>
				<motion.div
					className="grid grid-cols-3 gap-1 gap-y-4"
					variants={{
						show: {
							transition: {
								staggerChildren: 0.1,
							},
						},
					}}
					initial="hidden"
					animate="show"
				>
					{deckFields.map((field, index) => {
						return field.fieldType === "TEXT" ? (
							<motion.div
								className="grid w-full max-w-sm items-center gap-3"
								key={index}
								variants={{
									hidden: { opacity: 0, y: 20, scale: 0.95 },
									show: {
										opacity: 1,
										y: 0,
										scale: 1,
										transition: {
											duration: 0.3,
											ease: [0.25, 0.46, 0.45, 0.94],
										},
									},
								}}
								whileHover={{ scale: 1.02 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 + 0.2 }}
								>
									<Label
										className={"capitalize"}
										htmlFor={field.id}
									>
										{field.fieldName}{" "}
										<Ico
											src={textIcon}
											className="invert"
											size={15}
										/>
									</Label>
								</motion.div>
								<motion.div
									whileFocus={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}
								>
									<Input
										name={field.id}
										placeholder={field.fieldName}
										className={
											"placeholder:capitalize transition-all duration-200 focus:shadow-lg"
										}
										id={field.id}
										required={field.isRequired}
										type="text"
										defaultValue={
											defaultValues?.find(
												(item) =>
													item.deckFieldDefinitionId ===
													field.id
											)?.value
										}
									/>
								</motion.div>
							</motion.div>
						) : field.fieldType === "IMAGE" ? (
							<motion.div
								key={index}
								variants={{
									hidden: { opacity: 0, y: 20, scale: 0.95 },
									show: {
										opacity: 1,
										y: 0,
										scale: 1,
										transition: {
											duration: 0.3,
											ease: [0.25, 0.46, 0.45, 0.94],
										},
									},
								}}
								whileHover={{ scale: 1.02 }}
								transition={{ duration: 0.2 }}
							>
								<div className="grid w-full max-w-sm items-center gap-3">
									<motion.div
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											delay: index * 0.1 + 0.2,
										}}
									>
										<Label
											className={"capitalize"}
											htmlFor={field.id}
										>
											{field.fieldName}{" "}
											<Ico
												src={imageIcon}
												className="invert"
												size={15}
											/>
										</Label>
									</motion.div>
									<motion.div
										whileFocus={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
									>
										<Input
											name={field.id}
											className={
												"transition-all duration-200 focus:shadow-lg"
											}
											id={field.id}
											type="file"
											accept="image/*"
										/>
									</motion.div>
								</div>
							</motion.div>
						) : field.fieldType === "AUDIO" ? (
							<motion.div
								key={index}
								variants={{
									hidden: { opacity: 0, y: 20, scale: 0.95 },
									show: {
										opacity: 1,
										y: 0,
										scale: 1,
										transition: {
											duration: 0.3,
											ease: [0.25, 0.46, 0.45, 0.94],
										},
									},
								}}
								whileHover={{ scale: 1.02 }}
								transition={{ duration: 0.2 }}
							>
								<div className="grid w-full max-w-sm items-center gap-3">
									<motion.div
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											delay: index * 0.1 + 0.2,
										}}
									>
										<Label
											className={"capitalize"}
											htmlFor={field.id}
										>
											{field.fieldName}{" "}
											<Ico
												src={audioIcon}
												className="invert"
												size={15}
											/>
										</Label>
									</motion.div>
									<motion.div
										whileFocus={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
									>
										<Input
											name={field.id}
											className={
												"transition-all duration-200 focus:shadow-lg"
											}
											id={field.id}
											type="file"
											accept="audio/*"
										/>
									</motion.div>
								</div>
							</motion.div>
						) : null;
					})}
				</motion.div>
				<motion.div
					className="w-full flex justify-end mt-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.3 }}
				>
					<motion.div
						whileHover={{ scale: isPending ? 1 : 1.05 }}
						whileTap={{ scale: isPending ? 1 : 0.95 }}
						transition={{ duration: 0.2 }}
					>
						<Button
							className={
								"cursor-pointer transition-all duration-200"
							}
							variant={"default"}
							size={"default"}
							type="submit"
							disabled={isPending}
						>
							<motion.span
								key={isPending ? "loading" : "idle"}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								{isPending && !defaultValues ? (
									<span>Adding... ⟳</span>
								) : !isPending && !defaultValues ? (
									"Add Card +"
								) : !isPending && defaultValues ? (
									"Update Card +"
								) : (
									<span>Updating... ⟳</span>
								)}
							</motion.span>
						</Button>
					</motion.div>
				</motion.div>
			</motion.form>
		</>
	);
}
