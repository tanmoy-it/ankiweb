import Ico from "./ico";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/prisma/db";

export default async function UserLabel() {
	const session = await auth.api.getSession({ headers: await headers() });
	const user = session?.user;
	if (!user) {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-lime-100 px-4 pr-6 uppercase">
					<Link href={"/auth"}>Please log in</Link>
				</span>
				<Ico
					src={
						"https://cdn-icons-png.flaticon.com/512/149/149071.png"
					}
					size={35}
					className={
						"border-2 border-dune-500 rounded-full object-center object-cover"
					}
				/>
			</div>
		);
	}
	const userInfo = await db.user.findUnique({
		where: { id: user?.id },
		include: {
			profile: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
		},
	});
	
	return (
		<div className="flex items-center gap-2">
			{user ? (
				<span className="text-sm text-lime-50 font-bold capitalize hidden sm:inline-block">
					{userInfo?.profile?.firstName &&
					userInfo?.profile?.lastName ? (
						<Link href={"/profile/view/"}>
							{userInfo?.profile?.firstName +
								" " +
								userInfo?.profile?.lastName}
						</Link>
					) : (
						<Link href={"/profile/view"}>
							Add A Name
						</Link>
					)}
				</span>
			) : (
				<span className="text-sm text-lime-100 px-4 pr-6 uppercase">
					<Link href={"/auth"}>Please log in</Link>
				</span>
			)}
			<Ico
				src={
					user?.image ||
					"https://cdn-icons-png.flaticon.com/512/149/149071.png"
				}
				size={35}
				className={
					"border-2 border-dune-500 rounded-full object-center object-cover"
				}
			/>
		</div>
	);
}
