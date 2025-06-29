"use client";

import { Label } from "@/components/ui/label";
import Ico from "../../util-components/ico";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react";
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
	addNewRole,
	deleteRole,
	getAllRoles,
	updateRole,
} from "../access-control-actions";

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

export default function AccessControlPage() {
	const [loading, setLoading] = useState(false);
	const [rolesLoading, setRolesLoading] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(false);
	const [roles, setRoles] = useState<responseType[]>([]);
	const [editingRole, setEditingRole] = useState<responseType | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	async function handleDeleteRole(roleId: string) {
		try {
			setPendingDelete(true);
			const response = await deleteRole(roleId);
			if (!response.success) {
				throw new Error(response.error);
			}
			toast.success("Role deleted successfully!");
			fetchRoles();
		} catch (error: any) {
			console.error("Failed to delete role", error);
			toast.error(
				error.message || "Failed to delete role. Please try again."
			);
		} finally {
			setPendingDelete(false);
		}
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setLoading(true);
			let response = null;
			if (editingRole) {
				response = await updateRole(editingRole.id, values);
				if (!response.success) {
					throw new Error(response.error);
				}
				toast.success("Role Updated successfully!");
			} else {
				response = await addNewRole(values);
				if (!response.success) {
					throw new Error(response.error);
				}
				toast.success("Role Created successfully!");
			}
			setEditingRole(null);
			fetchRoles();
			form.reset();
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		} finally {
			setLoading(false);
		}
	}
	async function fetchRoles() {
		try {
			setRolesLoading(true);
			const response = await getAllRoles();
			if (!response.success) {
				throw new Error(response.error);
			}
			setRoles(response?.roles || []);
		} catch (error) {
			console.error("Failed to fetch roles", error);
			toast.error("Failed to fetch roles. Please try again.");
		} finally {
			setRolesLoading(false);
		}
	}
	useEffect(() => {
		fetchRoles();
	}, []);

	return (
		<div>
			<h2 className="text-xl uppercase tracking-wide flex items-center gap-3 text-dune-200">
				ROLES MANAGEMENT{" "}
				<Ico
					src="https://cdn-icons-png.flaticon.com/512/7542/7542190.png"
					className="invert"
				/>
			</h2>
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
												Role Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Admin"
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
												Role Description
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Admin of the system"
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
							{editingRole && (
								<Button
									size={"default"}
									className={"cursor-pointer"}
									variant="destructive"
									type="button"
									onClick={() => {
										setEditingRole(null);
										form.reset();
									}}
								>
									Cancel Editing
								</Button>
							)}
							{editingRole && (
								<Button
									size={"default"}
									className={"cursor-pointer"}
									variant="default"
									type="submit"
									disabled={loading}
								>
									{loading ? "Updating..." : "Update Role"}
								</Button>
							)}
							{!editingRole && (
								<Button
									size={"default"}
									className={"cursor-pointer"}
									variant="default"
									type="submit"
									disabled={loading}
								>
									{loading ? "Creating..." : "Create Role"}
								</Button>
							)}
						</div>
					</form>
				</Form>
			</div>
			<h2 className="text-lg font-semibold mt-3 text-dune-200">Roles</h2>
			<div className="w-full p-2 bg-dune-950/30 rounded-xl mt-1 grid grid-cols-4 gap-2 shadow-xl shadow-black/20">
				{rolesLoading ? (
					<span className="text-md text-white text-center col-span-3">
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/8089/8089457.png"
							className="invert ml-1"
							size={100}
						/>
					</span>
				) : (!roles || roles.length === 0) && !rolesLoading ? (
					<span className="text-md text-white text-center col-span-3">
						No Roles Found{" "}
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/42/42735.png"
							className="invert ml-1"
							size={15}
						/>
					</span>
				) : null}
				{roles &&
					roles?.map((role, index) => {
						return (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									duration: 0.2,
									ease: "easeInOut",
									delay: index * 0.05,
								}}
								key={role.id}
								className="hover:scale-[101%] transition-all hover:shadow-xl"
							>
								<div className="flex gap-2 justify-between items-center bg-dune-950/50 px-1 py-1 ps-3 rounded-xl">
									<h3 className="capitalize">
										<Ico
											src="https://cdn-icons-png.flaticon.com/512/8459/8459528.png"
											size={15}
											className="mr-3 invert"
										/>
										{role.name}
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
												setEditingRole(role);
												form.setValue(
													"name",
													role.name
												);
												form.setValue(
													"description",
													role.description || ""
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
											onClick={handleDeleteRole.bind(
												null,
												role.id
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
