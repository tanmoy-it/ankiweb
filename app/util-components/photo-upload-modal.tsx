"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Ico from "@/app/util-components/ico";
import { useState } from "react";
import PhotoUplaoderForm from "./photo-uploader-modal-shadbuilder";

export function PhotoUploadModal({ isUser }: { isUser?: boolean }) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className="text-white bg-transparent text-lg cursor-pointer hover:scale-105 transition-all rounded-lg hover:shadow-xl shadow-black/10 active:scale-[102%] backdrop-blur-sm">
					<div className="flex gap-2 p-3 bg-white/30 backdrop-blur-sm rounded-lg items-center group">
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/5460/5460486.png"
							className="group-hover:"
						/>{" "}
						<span className="text-blue-950">
							{isUser ? "Change Profile Photo" : "Upload Photo"}
						</span>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] ">
				<DialogHeader className=" mb-5">
					<DialogTitle className="">Upload Profile Photo</DialogTitle>
					<DialogDescription className="">
						Please upload a high resolution photo of yourself.
					</DialogDescription>
				</DialogHeader>
				<PhotoUplaoderForm onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
