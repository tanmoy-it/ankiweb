"use client";

import { Label } from "@/components/ui/label";
import Ico from "../../util-components/ico";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import {
	addNewPermission,
	deletePermission,
	getAllPermissions,
	updatePermission,
} from "../access-control-actions";
import { motion } from "motion/react";

export const formSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
});

type responseType = {
	name: string;
	description: string | null;
	id: string;
	createdAt: Date;
	updatedAt: Date;
};

export default function PermissionsPage() {
	const [loading, setLoading] = useState(false);
	const [permissionsLoading, setPermissionsLoading] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(false);
	const [permissions, setPermissions] = useState<responseType[]>([]);
	const [editingPermission, setEditingPermission] =
		useState<responseType | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	async function handleDeletePermission(permissionId: string) {
		try {
			setPendingDelete(true);
			const response = await deletePermission(permissionId);
			if (!response.success) {
				throw new Error(response.error);
			}
			toast.success("Permission deleted successfully!");
			fetchPermissions();
		} catch (error: any) {
			console.error("Failed to delete permission", error);
			toast.error(
				error.message ||
					"Failed to delete permission. Please try again."
			);
		} finally {
			setPendingDelete(false);
		}
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setLoading(true);
			let response = null;
			if (editingPermission) {
				response = await updatePermission(editingPermission.id, values);
				if (!response.success) {
					throw new Error(response.error);
				}
				toast.success("Permission Updated successfully!");
			} else {
				response = await addNewPermission(values);
				if (!response.success) {
					throw new Error(response.error);
				}
				toast.success("Permission Created successfully!");
			}
			setEditingPermission(null);
			fetchPermissions();
			form.reset();
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	async function fetchPermissions() {
		try {
			setPermissionsLoading(true);
			const response = await getAllPermissions();
			if (!response.success) {
				throw new Error(response.error);
			}
			setPermissions(response?.permissions || []);
		} catch (error) {
			console.error("Failed to fetch permissions", error);
			toast.error("Failed to fetch permissions. Please try again.");
		} finally {
			setPermissionsLoading(false);
		}
	}

	useEffect(() => {
		fetchPermissions();
	}, []);

	return (
		<div>
			<h1 className="text-xl uppercase tracking-wide flex items-center gap-3">
				Permissions Management{" "}
				<Ico
					src="https://cdn-icons-png.flaticon.com/512/18950/18950717.png"
					className="invert"
				/>
			</h1>
			<div className="w-full p-2 bg-dune-950/30 rounded-xl mt-3 shadow-xl shadow-black/20">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8 max-w-full mx-auto py-5 px-5"
					>
						<div className="grid grid-cols-12 gap-4">
							<div className="col-span-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }: { field: any }) => (
										<FormItem className={""}>
											<FormLabel className={""}>
												Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="create_posts"
													type="text"
													{...field}
												/>
											</FormControl>

											<FormMessage className={""} />
										</FormItem>
									)}
								/>
							</div>

							<div className="col-span-6">
								<FormField
									control={form.control}
									name="description"
									render={({ field }: { field: any }) => (
										<FormItem className={""}>
											<FormLabel className={""}>
												Description
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Allows user to create new posts"
													type="text"
													{...field}
												/>
											</FormControl>

											<FormMessage className={""} />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex gap-2">
							{editingPermission && (
								<Button
									size={"default"}
									className={"cursor-pointer"}
									variant="destructive"
									type="button"
									onClick={() => {
										setEditingPermission(null);
										form.reset();
									}}
								>
									Cancel Editing
								</Button>
							)}
							{editingPermission && (
								<Button
									size={"default"}
									className={"cursor-pointer"}
									variant="default"
									type="submit"
									disabled={loading}
								>
									{loading
										? "Updating..."
										: "Update Permission"}
								</Button>
							)}
							{!editingPermission && (
								<Button
									size={"default"}
									className={"cursor-pointer"}
									variant="default"
									type="submit"
									disabled={loading}
								>
									{loading
										? "Creating..."
										: "Create Permission"}
								</Button>
							)}
						</div>
					</form>
				</Form>
			</div>
			<h2 className="text-lg font-semibold mt-3">Permissions</h2>
			<div className="w-full p-2 bg-dune-950/30 rounded-xl mt-1 grid grid-cols-4 gap-2 shadow-xl shadow-black/20">
				{permissionsLoading ? (
					<span className="text-md text-white text-center col-span-3">
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/8089/8089457.png"
							className="invert ml-1"
							size={100}
						/>
					</span>
				) : (!permissions || permissions.length === 0) &&
				  !permissionsLoading ? (
					<span className="text-md text-white text-center col-span-3">
						No Permissions Found{" "}
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/42/42735.png"
							className="invert ml-1"
							size={15}
						/>
					</span>
				) : null}
				{permissions &&
					permissions?.map((permission, index) => {
						return (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									duration: 0.2,
									ease: "easeInOut",
									delay: index * 0.05,
								}}
								key={permission.id}
								className="hover:scale-[101%] transition-all hover:shadow-xl"
							>
								<div className="flex gap-2 justify-between items-center bg-dune-950/50 px-1 py-1 ps-3 rounded-xl">
									<h3 className="capitalize">
										<Ico
											src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
											size={15}
											className="mr-3 invert"
										/>
										{permission.name}
									</h3>
									<div className="flex items-center gap-1">
										<Button
											className={
												"rounded-xl cursor-pointer"
											}
											variant={"outline"}
											size={"sm"}
											disabled={pendingDelete}
											onClick={(e: any) => {
												e.preventDefault();
												setEditingPermission(
													permission
												);
												form.setValue(
													"name",
													permission.name
												);
												form.setValue(
													"description",
													permission.description || ""
												);
											}}
										>
											{" "}
											<Ico
												src="https://cdn-icons-png.flaticon.com/512/10573/10573605.png"
												className="invert"
												size={15}
											/>
										</Button>
										<Button
											className={
												"rounded-xl cursor-pointer"
											}
											variant={"outline"}
											size={"sm"}
											disabled={pendingDelete}
											onClick={handleDeletePermission.bind(
												null,
												permission.id
											)}
										>
											{" "}
											<Ico
												src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png"
												className="invert"
												size={15}
											/>
										</Button>
									</div>
								</div>
							</motion.div>
						);
					})}
			</div>
		</div>
	);
}
