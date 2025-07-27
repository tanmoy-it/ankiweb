import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function ConfirmAction({
    onConfirm,
	children,
}: {
    onConfirm?: () => void;
	children: React.ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild title={"Confirm Action"}>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className={""}>
					<DialogTitle className={""}>Are You Sure ?</DialogTitle>
					<DialogDescription className={""}>
						Are You sure You want to Perform This Action ?
					</DialogDescription>
				</DialogHeader>
				{/* no content because it is a dialog for confirmation */}
				<DialogFooter className="sm:justify-start md:justify-end mt-4">
					<DialogClose asChild>
						<Button
							className={""}
							size={"default"}
							type="button"
							variant="secondary"
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						className={""}
						size={"default"}
						type="submit"
						variant="destructive"
						onClick={onConfirm}
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
