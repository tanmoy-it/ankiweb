"use client";
import { useSession } from "@/lib/auth-client";
import Ico from "./ico";
import Link from "next/link";

export default function UserLabel() {
    const user = useSession()?.data?.user;
    
	return (
		<div className="flex items-center gap-2">
			{user ? (
				<span className="text-sm text-lime-50 font-bold capitalize hidden sm:inline-block">
					<Link href={"/profile/view/"}>{user.name || user.email}</Link>
				</span>
			) : (
				<span className="text-sm text-lime-100 px-4 pr-6 uppercase">
					<Link href={"/auth"}>Please log in</Link>
				</span>
			)}
			<Ico
				src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
				size={30}
				className={"border-1 border-lime-500 rounded-full"}
			/>
		</div>
	);
}
