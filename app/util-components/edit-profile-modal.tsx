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
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Ico from "@/app/util-components/ico";
import { useEffect, useState } from "react";
import {
	getAuthenticatedUserProfile,
	uploadPhotoAction,
} from "../server-actions/pfractions";
import PhotoUplaoderForm from "./photo-uploader-modal-shadbuilder";
import EditProfileForm from "./edit-profile-form";
import { set } from "date-fns";

export function EditProfileModal() {
	const [open, setOpen] = useState(false);
	const [defaultValues, setDefaultValues] = useState({
		first_name: "",
		last_name: "",
		display_name: "",
		user_bio: "",
		date_of_birth: new Date(),
		gender: "",
		phone: "",
		location: "",
		website: "",
		profession: "",
		current_company_name: "",
		latest_education_degree: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (open) {
			async function getUserProfile() {
				setIsLoading(true);
				const userProfile = await getAuthenticatedUserProfile();
				const profileData = {
					first_name: userProfile?.firstName || "",
					last_name: userProfile?.lastName || "",
					display_name: userProfile?.displayName || "",
					user_bio: userProfile?.bio || "",
					date_of_birth: userProfile?.dateOfBirth || new Date(),
					gender: userProfile?.gender || "",
					phone: userProfile?.phoneNumber || "",
					location: userProfile?.location || "",
					website: userProfile?.website || "",
					profession: userProfile?.profession || "",
					current_company_name: userProfile?.company || "",
					latest_education_degree: userProfile?.education || "",
				};
				setDefaultValues(profileData);
				console.log("Fetched profile data:", profileData);
				setIsLoading(false);
			}
			getUserProfile();
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className="text-white bg-transparent text-lg cursor-pointer hover:scale-105 transition-all rounded-lg hover:shadow-xl shadow-black/10 active:scale-[102%] backdrop-blur-sm border-2 border-stone-100">
					<div className="flex gap-2 p-1 px-2 bg-white/30 backdrop-blur-sm rounded-lg items-center group">
						<Ico
							src="https://cdn-icons-png.flaticon.com/512/17123/17123222.png"
							className="group-hover:"
						/>{" "}
						<span className="text-blue-950">Edit Profile</span>
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[80vw] sm:max-h-[90vh] overflow-auto">
				<DialogHeader className=" mb-5">
					<DialogTitle className="">Edit Profile</DialogTitle>
					<DialogDescription className="">
						Please fill in the details below to update your profile.
					</DialogDescription>
				</DialogHeader>
				{isLoading ? (
					<div className="flex justify-center p-8">
						<div className="animate-spin rounded-full h-10 w-10 border-b-3 border-gray-200"></div>
					</div>
				) : (
					<EditProfileForm defaultValues={defaultValues} />
				)}
			</DialogContent>
		</Dialog>
	);
}
