"use client";
import Image from "next/image";
import Pdiv from "@/app/util-components/pattern-div";
import Ico from "@/app/util-components/ico";
import { db } from "@/lib/prisma/db";


export default function Home() {
	// const users = db.user.findMany()
	return (
		<div className="bg-zinc-900 flex flex-col items-center justify-center rounded-xl border-1 border-zinc-700">
			<h1 className="text-2xl font-bold my-2 uppercase tracking-[15px]">
				Anki Web
				<Ico src="https://cdn-icons-png.flaticon.com/512/4588/4588102.png" className="invert" />
			</h1>
			<div className="w-full p-3 mb-3 grid grid-flow-row grid-col-1 md:grid-cols-2  gap-2 grid-rows-6">
				<div className="bg-white row-span-6 text-black rounded-lg overflow-hidden border-1 shadow-md shadow-black/50">
					<Image
						src="https://i.pinimg.com/736x/71/b4/04/71b40467c9e733326878bd26b6f50cb7.jpg"
						alt="Description of image"
						layout="responsive"
						width={2000}
						height={5000}
						className="object-cover w-full h-full rounded-lg"
					/>
				</div>
				<Pdiv
					src="https://as2.ftcdn.net/v2/jpg/07/90/87/79/1000_F_790877988_5FgYx3lt1DlcCUKLbw9EnNBI1peYxPOE.jpg"
					className="bg-white rounded-lg text-black flex justify-center items-center p-3 border-1 shadow-md shadow-black/50"
					size={200}
					opacity={0.2}
				>
				</Pdiv>
				<div className="row-span-5 rounded-lg bg-zinc-900 border-1 shadow-md shadow-black/50">
					<Pdiv className="p-2" size={300}></Pdiv>
				</div>
			</div>
		</div>
	);
}
