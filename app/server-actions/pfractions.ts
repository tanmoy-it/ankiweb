"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { db } from "@/lib/prisma/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function uploadPhotoAction(previousState: unknown, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    try {
        const file = formData.get("picture") as File;

        if (!file || file.size === 0) {
            return { error: "No file uploaded" };
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return { error: "Only image files are allowed" };
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { error: "File size must be less than 5MB" };
        }

        // Create uploads directory if it doesn't exist
        const uploadDir = join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}_${originalName}`;
        const filepath = join(uploadDir, filename);

        // Convert file to buffer and write to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return the public URL path
        const publicPath = `/uploads/${filename}`;

        // write the file path to the database
        await db.user.update({
            where: { id: session.user.id },
            data: {
                image: publicPath,
            },
        });
        revalidatePath("/profile/view");
        return { success: true, path: publicPath };
    } catch (error) {
        console.error("Upload error:", error);
        return { 
            error: error instanceof Error ? error.message : "Upload failed" 
        };
    }
}

export async function updateProfileAction(previousState: unknown, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    try {
        // Extract and validate form data
        const firstName = formData.get("first_name") as string;
        const lastName = formData.get("last_name") as string;
        const displayName = formData.get("display_name") as string;
        const bio = formData.get("user_bio") as string;
        const dateOfBirth = formData.get("date_of_birth") as string;
        const gender = formData.get("gender") as string;
        const phone = formData.get("phone") as string;
        const location = formData.get("location") as string;
        const website = formData.get("website") as string;
        const profession = formData.get("profession") as string;
        const company = formData.get("current_company_name") as string;
        const education = formData.get("latest_education_degree") as string;

        // Basic validation
        if (!firstName?.trim() || !lastName?.trim() || !displayName?.trim()) {
            return { error: "First name, last name, and display name are required" };
        }

        // Update or create profile
        await db.profile.upsert({
            where: { userId: session.user.id },
            update: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                displayName: displayName.trim(),
                bio: bio?.trim() || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender: gender?.trim() || null,
                phoneNumber: phone?.trim() || null,
                location: location?.trim() || null,
                website: website?.trim() || null,
                profession: profession?.trim() || null,
                company: company?.trim() || null,
                education: education?.trim() || null,
            },
            create: {
                userId: session.user.id,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                displayName: displayName.trim(),
                bio: bio?.trim() || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender: gender?.trim() || null,
                phoneNumber: phone?.trim() || null,
                location: location?.trim() || null,
                website: website?.trim() || null,
                profession: profession?.trim() || null,
                company: company?.trim() || null,
                education: education?.trim() || null,
            },
        });

        revalidatePath("/profile/view");
        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        console.error("Profile update error:", error);
        return { 
            error: error instanceof Error ? error.message : "Failed to update profile" 
        };
    }
}


export async function getAuthenticatedUserProfile() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const profile = await db.profile.findUnique({
        where: {
            userId: session?.user?.id,
        }
    })

    if (!profile) {
        return null;
    }
    return profile;
}