import { EditProfileModal } from "@/app/util-components/edit-profile-modal";
import Ico from "@/app/util-components/ico";
import Pdiv from "@/app/util-components/pattern-div";
import { PhotoUploadModal } from "@/app/util-components/photo-upload-modal";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma/db";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function UserProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user;
	const profile = await db.profile.findUnique({
		where: {
			userId: user?.id,
		}
	})

	return (
		<div className="flex flex-col lg:grid lg:grid-cols-9 lg:grid-rows-6 gap-3 p-3 lg:grid-flow-row min-h-[90vh]">
			<div className="shadow-xl lg:row-span-6 lg:col-span-3 rounded-xl overflow-hidden h-96 lg:h-auto">
				<div className="text-black text-2xl flex items-center justify-center w-full h-full relative">
					{!user?.image && (
						<Image
							src="https://cdn.midjourney.com/067ea16b-4d91-4342-a7f3-80c90825ae47/0_0.jpeg"
							alt="profile image"
							width={2048}
							height={2048}
							className="w-full h-full object-cover"
						/>
					)}
					{user?.image && (
						<Image
							src={user?.image}
							alt="profile image"
							width={2048}
							height={2048}
							className="w-full h-full object-cover"
						/>
					)}
					<div className="absolute top-0 mt-3">
						<PhotoUploadModal isUser={user ? true : false} />
					</div>
				</div>
			</div>
			<div className="bg-gray-100 p-3 shadow-xl lg:row-span-4 lg:col-span-6 rounded-xl text-black flex flex-col gap-3 relative w-full overflow-y-auto">
				<div className="absolute top-0 mt-3 right-3">
					<EditProfileModal />
				</div>
                <div className="p-3 mt-10 md:mt-0 bg-white rounded-lg w-max max-w-full text-lg tracking-wide font-bold capitalize flex items-center flex-wrap"> <Ico src="https://cdn-icons-png.flaticon.com/512/17746/17746546.png" className="mr-3"/> <span className="truncate">{`${profile?.firstName} ${profile?.lastName} (${profile?.displayName})`}</span></div>
                <div className="p-2 bg-white rounded-lg w-full text-sm flex items-start"><Ico src="https://cdn-icons-png.flaticon.com/512/1828/1828384.png" className="mr-10 mt-1 flex-shrink-0 w-5 h-5"/><p className="text-justify p-2"><br />{profile?.bio}</p></div>
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
					<div className="p-2 bg-white rounded-lg w-full capitalize text-sm flex items-center"> <Ico src="https://cdn-icons-png.flaticon.com/512/12371/12371238.png" className="mr-3 flex-shrink-0"/>{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}</div>
					<div className="p-2 bg-white rounded-lg w-full capitalize flex items-center"><Ico src="https://cdn-icons-png.flaticon.com/512/3658/3658764.png" className="mr-3 flex-shrink-0"/> {profile?.gender}</div>
					<div className="p-2 bg-white rounded-lg w-full capitalize flex items-center"><Ico src="https://cdn-icons-png.flaticon.com/512/17982/17982121.png" className="mr-3 flex-shrink-0"/> {profile?.phoneNumber}</div>
					<div className="p-2 bg-white rounded-lg w-full capitalize flex items-center"><Ico src="https://cdn-icons-png.flaticon.com/512/9101/9101314.png" className="mr-3 flex-shrink-0"/> {profile?.location}</div>
					<div className="p-2 bg-white rounded-lg w-full capitalize flex items-center truncate"><Ico src="https://cdn-icons-png.flaticon.com/512/3308/3308395.png" className="mr-3 flex-shrink-0"/> {profile?.website ? <Link rel="noopener noreferrer" href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="blank" className="hover:underline underline-offset-3 truncate">{profile.website}</Link> : 'Not specified'} </div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
					<div className="p-2 bg-white rounded-lg w-full capitalize flex items-center"><Ico src="https://cdn-icons-png.flaticon.com/512/4801/4801325.png" className="mr-3 flex-shrink-0"/> {profile?.profession}</div>
					<div className="p-2 bg-white rounded-lg w-full capitalize flex items-center"><Ico src="https://cdn-icons-png.flaticon.com/512/4300/4300059.png" className="mr-3 flex-shrink-0"/> {profile?.company}</div>
					<div className="p-2 bg-white rounded-lg w-full capitalize flex items-center"><Ico src="https://cdn-icons-png.flaticon.com/512/4207/4207247.png" className="mr-3 flex-shrink-0"/> {profile?.education}</div>
				</div>
            </div>
			<Pdiv className="bg-white shadow-xl lg:row-span-2 lg:col-span-3 rounded-xl h-64 lg:h-auto" size={500} src="https://i.pinimg.com/736x/29/c8/12/29c812a55dfb24e655eb2fbbe6fa417a.jpg"></Pdiv>
			<Pdiv className="bg-white shadow-xl lg:row-span-2 lg:col-span-3 rounded-xl h-64 lg:h-auto" size={500}></Pdiv>
		</div>
	);
}
