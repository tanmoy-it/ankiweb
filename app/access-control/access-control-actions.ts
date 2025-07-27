"use server";

import { z } from "zod";
import { db } from "@/lib/prisma/db";
import { formSchema } from "./types";

// role CRUD
export async function addNewRole(values: z.infer<typeof formSchema>) {
	try {
		const newRole = db.role.create({
			data: {
				name: values.name,
				description: values.description,
			},
		});
		if (!newRole) {
			throw new Error("Failed to create new role");
		}
		return { success: true, role: newRole };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

export async function getAllRoles() {
	try {
		const roles = await db.role.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		return { success: true, roles };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

export async function updateRole(
	id: string,
	values: z.infer<typeof formSchema>
) {
	try {
		const updatedRole = await db.role.update({
			where: { id },
			data: {
				name: values.name,
				description: values.description,
			},
		});
		return { success: true, role: updatedRole };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

export async function deleteRole(id: string) {
	try {
		const deletedRole = await db.role.delete({
			where: { id },
		});
		return { success: true, role: deletedRole };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

// permission CRUD
export async function addNewPermission(values: z.infer<typeof formSchema>) {
	try {
		const newPermission = await db.permission.create({
			data: {
				name: values.name,
				description: values.description,
			},
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		if (!newPermission) {
			throw new Error("Failed to create new permission");
		}
		return { success: true, permission: newPermission };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

export async function getAllPermissions() {
	try {
		const permissions = await db.permission.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return { success: true, permissions };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

export async function updatePermission(
	id: string,
	values: z.infer<typeof formSchema>
) {
	try {
		const updatedPermission = await db.permission.update({
			where: { id },
			data: {
				name: values.name,
				description: values.description,
			},
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return { success: true, permission: updatedPermission };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

export async function deletePermission(id: string) {
	try {
		const deletedPermission = await db.permission.delete({
			where: { id },
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return { success: true, permission: deletedPermission };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

// role access binding CRUD
export async function getAllPermissionsForRole(roleID: string) {
	try {
		const boundPerms = await db.rolePermission.findMany({
			where: {
				roleId: roleID,
			},
		});
		const boundPermissionIDs = boundPerms.map((item) => item.permissionId);

		const boundPermissions = await db.permission.findMany({
			where: {
				id: {
					in: boundPermissionIDs,
				},
			},
		});

		const unboundPermissions = await db.permission.findMany({
			where: {
				NOT: {
					id: {
						in: boundPermissionIDs,
					},
				},
			},
		});
		return {
			success: true,
			boundPermissions: boundPermissions,
			unboundPermissions: unboundPermissions,
		};
	} catch (error: Error | unknown) {
		console.error((error as Error).message);
		return {
			success: false,
			error: error,
		};
	}
}

export async function bindThisPermissionToRole(roleID: string, permissionID: string) {
	try {
		const newBinding = await db.rolePermission.create({
			data: {
				roleId: roleID,
				permissionId: permissionID,
			},
		});
		if (!newBinding) {
			throw new Error("Failed to bind permission to role");
		}
		return { success: true, binding: newBinding };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}

export async function unbindThisPermissionFromRole(roleID: string, permissionID: string) {
	try {
		const deletedBinding = await db.rolePermission.delete({
			where: {
				roleId_permissionId: {
					roleId: roleID,
					permissionId: permissionID,
				},
			},
		});
		if (!deletedBinding) {
			throw new Error("Failed to unbind permission from role");
		}
		return { success: true, binding: deletedBinding };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}