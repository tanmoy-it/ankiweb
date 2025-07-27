import { EditProfileModal } from "@/app/util-components/edit-profile-modal";
import Ico from "@/app/util-components/ico";
import Pdiv from "@/app/util-components/pattern-div";
import { PhotoUploadModal } from "@/app/util-components/photo-upload-modal";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma/db";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	
	const user = session?.user;
	
	if (!user) {
		redirect('/auth/signin');
	}

	const profile = await db.profile.findUnique({
		where: {
			userId: user.id,
		}
	});

	// Create a default profile object for better UX
	const displayProfile = {
		firstName: profile?.firstName || 'First',
		lastName: profile?.lastName || 'Last',
		displayName: profile?.displayName || user.name || 'User',
		bio: profile?.bio || 'No bio available yet. Add your bio to tell others about yourself!',
		dateOfBirth: profile?.dateOfBirth,
		gender: profile?.gender || 'Not specified',
		phoneNumber: profile?.phoneNumber || 'Not specified',
		location: profile?.location || 'Not specified',
		website: profile?.website,
		profession: profile?.profession || 'Not specified',
		company: profile?.company || 'Not specified',
		education: profile?.education || 'Not specified',
	};

	const formatDate = (date: Date | null | undefined) => {
		if (!date) return 'Not specified';
		return new Date(date).toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	};

	const formatWebsite = (website: string | null | undefined) => {
		if (!website) return null;
		return website.startsWith('http') ? website : `https://${website}`;
	};

	return (
		<div className="flex flex-col lg:flex-row gap-4 p-2 lg:p-4 h-[calc(100vh-5rem)] max-w-7xl mx-auto">
			{/* Left Column - Profile Image and Basic Info */}
			<div className="lg:w-1/3 flex flex-col gap-4 lg:h-full">
				{/* Profile Image Section */}
				<div className="shadow-xl rounded-xl overflow-hidden h-64 sm:h-80 lg:h-auto lg:flex-grow relative bg-gradient-to-br from-blue-50 to-purple-50">
					<div className="w-full h-full relative">
						<Image
							src={user.image || "https://i.pinimg.com/736x/ef/4f/98/ef4f982361420e1921bedac60c6598d4.jpg"}
							alt={`${displayProfile.displayName}'s profile picture`}
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute top-2 right-2 z-10">
							<PhotoUploadModal isUser={true} />
						</div>
					</div>
				</div>

				{/* Basic Info Section */}
				<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-xl rounded-xl text-gray-800 flex flex-col gap-3">
					{/* Name and Display Name */}
					<div className="p-3 bg-white rounded-lg w-full text-base lg:text-lg tracking-wide font-bold capitalize flex items-center shadow-sm border border-gray-100"> 
						<Ico src="https://cdn-icons-png.flaticon.com/512/17746/17746546.png" className="mr-3 flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6"/> 
						<span className="truncate">
							{`${displayProfile.firstName} ${displayProfile.lastName}`}
							{displayProfile.displayName && displayProfile.displayName !== `${displayProfile.firstName} ${displayProfile.lastName}` && (
								<span className="text-gray-600 font-normal ml-1">({displayProfile.displayName})</span>
							)}
						</span>
					</div>

					{/* Bio Section */}
					<div className="p-3 bg-white rounded-lg w-full text-xs sm:text-sm flex items-start shadow-sm border border-gray-100">
						<Ico src="https://cdn-icons-png.flaticon.com/512/1828/1828384.png" className="mr-3 mt-1 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5"/>
						<p className="text-justify leading-relaxed text-gray-700">{displayProfile.bio}</p>
					</div>
				</div>
			</div>

			{/* Right Column - Detailed Information */}
			<div className="lg:w-2/3 flex flex-col gap-4 lg:h-full overflow-y-auto">
				{/* Profile Details Section */}
				<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-xl rounded-xl text-gray-800 flex w-full gap-4">
					{/* Details Grid (80%) */}
					<div className="flex-1">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
							{/* Date of Birth */}
							<div className="p-3 bg-white rounded-lg w-full capitalize flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100"> 
								<Ico src="https://cdn-icons-png.flaticon.com/512/12371/12371238.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-blue-600"/>
								<span className="text-gray-700">{formatDate(displayProfile.dateOfBirth)}</span>
							</div>

							{/* Gender */}
							<div className="p-3 bg-white rounded-lg w-full capitalize flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100">
								<Ico src="https://cdn-icons-png.flaticon.com/512/3658/3658764.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-purple-600"/> 
								<span className="text-gray-700">{displayProfile.gender}</span>
							</div>

							{/* Phone Number */}
							<div className="p-3 bg-white rounded-lg w-full flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100">
								<Ico src="https://cdn-icons-png.flaticon.com/512/17982/17982121.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-green-600"/> 
								<span className="text-gray-700">{displayProfile.phoneNumber}</span>
							</div>

							{/* Location */}
							<div className="p-3 bg-white rounded-lg w-full capitalize flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100">
								<Ico src="https://cdn-icons-png.flaticon.com/512/9101/9101314.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-red-600"/> 
								<span className="text-gray-700">{displayProfile.location}</span>
							</div>

							{/* Website */}
							<div className="p-3 bg-white rounded-lg w-full flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100">
								<Ico src="https://cdn-icons-png.flaticon.com/512/3308/3308395.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-indigo-600"/> 
								<span className="text-gray-700 truncate">
									{displayProfile.website ? (
										<Link 
											rel="noopener noreferrer" 
											href={formatWebsite(displayProfile.website) || '#'} 
											target="_blank" 
											className="hover:underline underline-offset-2 text-blue-600 hover:text-blue-800 transition-colors"
										>
											{displayProfile.website}
										</Link>
									) : (
										'Not specified'
									)}
								</span>
							</div>

							{/* Profession */}
							<div className="p-3 bg-white rounded-lg w-full capitalize flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100">
								<Ico src="https://cdn-icons-png.flaticon.com/512/4801/4801325.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-yellow-600"/> 
								<span className="text-gray-700">{displayProfile.profession}</span>
							</div>

							{/* Company */}
							<div className="p-3 bg-white rounded-lg w-full capitalize flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100">
								<Ico src="https://cdn-icons-png.flaticon.com/512/4300/4300059.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-teal-600"/> 
								<span className="text-gray-700">{displayProfile.company}</span>
							</div>

							{/* Education */}
							<div className="p-3 bg-white rounded-lg w-full capitalize flex items-center hover:scale-[102%] hover:shadow-lg transition-all duration-200 border border-gray-100">
								<Ico src="https://cdn-icons-png.flaticon.com/512/4207/4207247.png" className="mr-3 flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 text-orange-600"/> 
								<span className="text-gray-700">{displayProfile.education}</span>
							</div>
						</div>
					</div>

					{/* Edit Button */}
					<div className="flex-shrink-0 flex justify-end items-start">
						<EditProfileModal />
					</div>
				</div>

				{/* Additional Content Section */}
				<div className="flex-1 min-h-0">
					<Pdiv className="bg-white shadow-xl rounded-xl h-full w-full" size={500} />
				</div>
			</div>
		</div>
	);
}
