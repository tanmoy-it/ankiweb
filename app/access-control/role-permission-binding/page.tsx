"use client";

import Ico from "@/app/util-components/ico";
import SearchPanel from "../search-panel";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
	getAllPermissions,
	getAllPermissionsForRole,
	getAllRoles,
	bindThisPermissionToRole,
	unbindThisPermissionFromRole,
} from "../access-control-actions";
import { toast } from "sonner";

export default function RoleAccessBindingPage() {
	const [roles, setRoles] = useState<any[] | undefined>([]);
	const [rolesLoading, setRoleLoading] = useState(false);

	const [bindingRole, setBindingRole] = useState<any>(null);
	const [bindingPermission, setBindingPermission] = useState<any>(null);

	const [boundPermissions, setBoundPermissions] = useState<any[]>([]);
	const [unboundPermissions, setUnboundPermissions] = useState<any[]>([]);

	const [boundFilter, setBoundFilter] = useState("");
	const [unboundFilter, setUnboundFilter] = useState("");

	const [loadingBinder, setLoadingBinder] = useState(false);

	async function fetchRoles() {
		setRoleLoading(true);
		try {
			const response = await getAllRoles();
			const data = response.roles;
			setRoles(data);
		} catch (error) {
			console.error("Failed to fetch roles:", error);
		} finally {
			setRoleLoading(false);
		}
	}

	function setActiveRole(role: any) {
		setBindingPermission(null);
		setBindingRole(role);
	}

	useEffect(() => {
		fetchRoles();
	}, []);

	async function getPermissionsForRole() {
		if (!bindingRole) return;
		setLoadingBinder(true);
		const result = await getAllPermissionsForRole(bindingRole.id);
		if (result.success) {
			console.log("Bound Permissions:", result.boundPermissions);
			console.log("Unbound Permissions:", result.unboundPermissions);
			setBoundPermissions(result.boundPermissions ?? []);
			setUnboundPermissions(result.unboundPermissions ?? []);
		} else {
			toast.error("couldn't find permissions for this role");
		}
		setLoadingBinder(false);
	}

	async function bindPermissionToRole(permission: any) {
		if (!bindingRole || !permission) return;
		try {
			setLoadingBinder(true);
			const resopnse = await bindThisPermissionToRole(
				bindingRole.id,
				permission.id
			);
			if (resopnse.success) {
				toast.success("Permission bound to role successfully!");
				setBoundPermissions((prev) => [...prev, permission]);
				setUnboundPermissions((prev) =>
					prev.filter((perm) => perm.id !== permission.id)
				);
			} else {
				toast.error("Failed to bind permission to role");
			}
		} catch (error) {
			console.error("Failed to bind permission to role:", error);
			toast.error("Failed to bind permission to role");
		} finally {
			setLoadingBinder(false);
		}
	}
	async function unbindPermissionFromRole(permission: any) {
		if (!bindingRole || !permission) return;
		try {
			setLoadingBinder(true);
			const response = await unbindThisPermissionFromRole(
				bindingRole.id,
				permission.id
			);
			if (response.success) {
				toast.success("Permission unbound from role successfully!");
				setUnboundPermissions((prev) => [...prev, permission]);
				setBoundPermissions((prev) =>
					prev.filter((perm) => perm.id !== permission.id)
				);
			} else {
				toast.error("Failed to unbind permission from role");
			}
		} catch (error) {
			console.error("Failed to unbind permission from role:", error);
			toast.error("Failed to unbind permission from role");
		} finally {
			setLoadingBinder(false);
		}
	}

	useEffect(() => {
		if (bindingRole && !bindingPermission) {
			getPermissionsForRole();
		}
	}, [bindingRole, bindingPermission]);

	return (
		<div>
			<h1 className="text-xl uppercase tracking-wide flex items-center gap-3">
				Role Access Binding Management{" "}
				<Ico
					src="https://cdn-icons-png.flaticon.com/512/18950/18950717.png"
					className="invert"
				/>
			</h1>

			<div className="grid grid-cols-5 gap-1 mt-3 h-[80vh]">
				<div className="p-3 bg-dune-950/30 rounded-2xl shadow-xl shadow-black/50">
					<SearchPanel
						entities={roles}
						entitiesLoading={rolesLoading}
						setActiveEntity={setActiveRole}
						label="role"
					/>
				</div>
				<div
					className={`p-3 bg-dune-950/30 col-span-4 shadow-xl shadow-black/50 rounded-2xl ${!loadingBinder ? "" : "opacity-50 pointer-events-none cursor-not-allowed"} relative`}
				>
					{/* a spinner */}
					{loadingBinder && (
						<div className="absolute top-0 right-0 z-10">
							<Ico
								src="https://cdn-icons-png.flaticon.com/512/10539/10539493.png"
								className="animate-spin invert"
								size={40}
							/>
						</div>
					)}
					{bindingRole || bindingPermission ? (
						<h2 className="text-lg font-semibold mb-3 text-center">
							<span className="text-dune-500/60">
								Selected Role:{" "}
							</span>
							<span className="text-dune-50 uppercase">
								{bindingRole ? bindingRole.name : ""}
							</span>
						</h2>
					) : null}
					<div>
						{bindingRole &&
							(boundPermissions.length > 0 ||
								unboundPermissions.length > 0) && (
								<div className="flex flex-col gap-5">
									<div className="p-3 rounded-lg flex flex-col gap-2 bg-black/15">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold tracking-wide text-dune-100/40">
												Bound Permissions (Can)
												<p className="text-xs text-dune-100/10">
													(click to unbind permission
													from the role)
												</p>
											</h3>
											<div>
												<input
													type="text"
													placeholder="Filter Bound Permissions"
													value={boundFilter}
													onChange={(e) =>
														setBoundFilter(
															e.target.value
														)
													}
													className="p-2 px-3 border-1 rounded-lg focus-visible:outline-1 text-sm text-dune-100/80 placeholder:text-dune-100/40 transition-all"
												/>
											</div>
										</div>
										<hr />
										<div className="flex flex-wrap gap-1 mt-2 pb-3">
											<AnimatePresence>
												{boundPermissions
													.filter((permission) =>
														permission.name
															.toLowerCase()
															.includes(
																boundFilter.toLowerCase()
															)
													)
													.map((permission) => (
														<motion.div
															key={permission.id}
															initial={{
																scale: 0,
															}}
															animate={{
																scale: 1,
															}}
															exit={{
																scale: 0,
																opacity: 0,
															}}
														>
															<div
																key={
																	permission.id
																}
																className="p-1 bg-dune-800/60 rounded-md tracking-wide cursor-pointer hover:bg-dune-300/30 duration-100 text-md px-2 hover:scale-105 transition-all hover:shadow-lg hover:shadow-black/30"
																onClick={() =>
																	unbindPermissionFromRole(
																		permission
																	)
																}
															>
																{
																	permission.name
																}
															</div>
														</motion.div>
													))}
											</AnimatePresence>
										</div>
									</div>
									<div className="p-3 rounded-lg flex flex-col gap-2 bg-black/15">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold tracking-wide text-dune-100/40">
												Un-Bound Permissions (Can't)
												<p className="text-xs text-dune-100/10">
													(click to bind permission to
													the role)
												</p>
											</h3>
											<div>
												<input
													type="text"
													placeholder="Filter Un-Bound Permissions"
													value={unboundFilter}
													onChange={(e) =>
														setUnboundFilter(
															e.target.value
														)
													}
													className="p-2 px-3 border-1 rounded-lg focus-visible:outline-1 text-sm text-dune-100/80 placeholder:text-dune-100/40 transition-all"
												/>
											</div>
										</div>
										<hr />
										<div className="flex flex-wrap gap-1 mt-2 pb-3">
											<AnimatePresence>
												{unboundPermissions
													.filter((permission) =>
														permission.name
															.toLowerCase()
															.includes(
																unboundFilter.toLowerCase()
															)
													)
													.map((permission) => (
														<motion.div
															key={permission.id}
															initial={{
																scale: 0,
															}}
															animate={{
																scale: 1,
															}}
															exit={{
																scale: 0,
																opacity: 0,
															}}
														>
															<div
																className="p-1 bg-dune-800/60 rounded-md tracking-wide cursor-pointer hover:bg-dune-300/30 duration-100 text-md px-2 hover:scale-105 transition-all hover:shadow-lg hover:shadow-black/30"
																onClick={() => {
																	bindPermissionToRole(
																		permission
																	);
																}}
															>
																{
																	permission.name
																}
															</div>
														</motion.div>
													))}
											</AnimatePresence>
										</div>
									</div>
								</div>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}
