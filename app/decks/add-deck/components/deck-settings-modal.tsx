"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Ico from "@/app/util-components/ico";
import { useDeckSettings } from "../hooks/useDeckSettings";

const DeckSettingsModal = memo(function DeckSettingsModal({
	deckID,
	onClose,
}: {
	deckID?: string;
	onClose: () => void;
}) {
	const {
		settings,
		loading,
		state,
		formAction,
		isPending,
		handleSettingChange,
	} = useDeckSettings(deckID);

	const modalContent = useMemo(() => {
		if (!deckID) {
			return null;
		}
		return (
			<>
				<DialogHeader className="">
					<DialogTitle className="flex items-center gap-2">
						Deck Settings{" "}
						<Ico
							src="https://cdn-icons.flaticon.com/svg/19000/19000516.svg?token=exp=1751715260~hmac=189ef162db2e6cd88c22c3ff6b2001cb"
							size={16}
							className="invert"
						/>
					</DialogTitle>
					<DialogDescription className="">
						Manage your deck settings here.
					</DialogDescription>
				</DialogHeader>
				<div className="bg-dune-950/[1%] p-3 rounded-lg border-1 border-dune-500/10 shadow-md">
					{loading && (
						<div className="col-span-3">
							<p className="text-lg text-gray-500">
								Loading deck settings...
							</p>
						</div>
					)}
					{settings && (
						<form action={() => formAction(settings)}>
							{state?.error && (
								<p className="text-red-500 p-2 px-3 bg-red-500/5 border-2 border-red-500/10 rounded-lg mb-4 flex items-center justify-between">
									{state.message}
								</p>
							)}
							{!state?.error && state?.message && (
								<p className="text-green-500 p-2 px-3 bg-green-500/5 border-2 border-green-500/10 rounded-lg mb-4 flex items-center justify-between">
									{state.message}
								</p>
							)}
							<div className="grid grid-cols-3 gap-2">
								<div className="space-y-2">
									<Label className={""} htmlFor="cardPerDay">
										Cards Per Day
									</Label>
									<Input
										className={""}
										id="cardPerDay"
										type="number"
										name="cardPerDay"
										value={settings.cardPerDay}
										// eslint-disable-next-line
										onChange={(e: any) =>
											handleSettingChange(
												"cardPerDay",
												parseInt(e.target.value, 10) ||
													0
											)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label
										className={""}
										htmlFor="maxReviewCards"
									>
										Max Review Cards
									</Label>
									<Input
										className={""}
										id="maxReviewCards"
										type="number"
										name="maxReviewCards"
										value={settings.maxReviewCards}
										// eslint-disable-next-line
										onChange={(e: any) =>
											handleSettingChange(
												"maxReviewCards",
												parseInt(e.target.value, 10) ||
													0
											)
										}
									/>
								</div>
								<div className="flex items-center space-x-2 pt-5">
									<Checkbox
										className={""}
										name="showAnswerAfterQuestion"
										checked={
											settings.showAnswerAfterQuestion
										}
										onCheckedChange={(checked: boolean) => {
											handleSettingChange(
												"showAnswerAfterQuestion",
												checked
											);
										}}
									/>
									<Label
										className={""}
										htmlFor="showAnswerAfterQuestion"
									>
										Show Answer After Question
									</Label>
								</div>
							</div>
							<DialogFooter className="sm:justify-end mt-3">
								<DialogClose asChild>
									<Button
										size="default"
										className=""
										type="button"
										variant="secondary"
									>
										Close
									</Button>
								</DialogClose>
								<Button
									type="submit"
									className={""}
									variant="default"
									size="default"
								>
									{isPending ? "Saving..." : "Save Settings"}
								</Button>
							</DialogFooter>
						</form>
					)}
				</div>
			</>
		);
	}, [
		deckID,
		loading,
		settings,
		handleSettingChange,
		state,
		formAction,
		isPending,
	]);

	return (
		<Dialog
			open={!!deckID}
			// eslint-disable-next-line
			onOpenChange={(isOpen: any) => !isOpen && onClose()}
		>
			<DialogContent className="sm:max-w-[60%]">
				{modalContent}
			</DialogContent>
		</Dialog>
	);
});

export default DeckSettingsModal;
