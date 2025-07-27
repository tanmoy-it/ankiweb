"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { CloudUpload, Paperclip } from "lucide-react";
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from "@/components/ui/extension/file-upload";
import { uploadPhotoAction } from "@/app/server-actions/pfractions";

const formSchema = z.object({
	picture: z.instanceof(File).optional(),
});

export default function PhotoUplaoderForm({ onSuccess }: { onSuccess?: () => void }) {
	const [files, setFiles] = useState<File[] | null>(null);
	const [state, formAction, isPending] = useActionState(uploadPhotoAction, null);

	const dropZoneConfig = {
		maxFiles: 1,
		maxSize: 1024 * 1024 * 5, // 5MB to match server validation
		multiple: false,
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	// Handle server action response with useEffect to avoid infinite re-renders
	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
		if (state?.success) {
			toast.success("Photo uploaded successfully!");
			setFiles(null);
			form.reset();
			onSuccess?.();
		}
	}, [state, form, onSuccess]);


	return (
		<Form {...form}>
			<form
				action={formAction}
				className="space-y-8 max-w-3xl mx-auto py-10"
			>
				{/* Hidden input to include the file in FormData */}
				<input
					type="file"
					name="picture"
					style={{ display: "none" }}
					ref={(input) => {
						if (input && files?.[0]) {
							const dt = new DataTransfer();
							dt.items.add(files[0]);
							input.files = dt.files;
						}
					}}
				/>
				
				<FormField
					control={form.control}
					name="picture"
					// eslint-disable-next-line
					render={({ field }: { field: any }) => (
						<FormItem className={""}>
							<FormLabel className={""}>
								Select Profile Picture
							</FormLabel>
							<FormControl>
								<FileUploader
									value={files}
									onValueChange={setFiles}
									dropzoneOptions={dropZoneConfig}
									className="relative bg-background rounded-lg p-2"
								>
									<FileInput
										id="fileInput"
										className="outline-dashed outline-1 outline-slate-500"
									>
										<div className="flex items-center justify-center flex-col p-8 w-full ">
											<CloudUpload className="text-gray-500 w-10 h-10" />
											<p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
												<span className="font-semibold">
													Click to upload
												</span>
												&nbsp; or drag and drop
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												PNG, JPG or GIF (max 5MB)
											</p>
										</div>
									</FileInput>
									<FileUploaderContent>
										{files &&
											files.length > 0 &&
											files.map((file, i) => (
												<FileUploaderItem
													key={i}
													index={i}
												>
													<Paperclip className="h-4 w-4 stroke-current" />
													<span>{file.name}</span>
												</FileUploaderItem>
											))}
									</FileUploaderContent>
								</FileUploader>
							</FormControl>
							<FormDescription className={""}>
								Select an image file to upload as your profile picture.
							</FormDescription>
							<FormMessage className={""} />
						</FormItem>
					)}
				/>
				<Button
					variant={"default"}
					className={"cursor-pointer"}
					size={"default"}
					type="submit"
					disabled={!files || files.length === 0 || isPending}
				>
					{isPending ? "Uploading..." : "Upload Photo"}
				</Button>
			</form>
		</Form>
	);
}
