"use client";

import * as React from "react";
import Link from "next/link";
import {
	LogOutIcon,
} from "lucide-react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Ico from "./ico";

export function NavBar() {
	const router = useRouter();
	return (
		<NavigationMenu viewport={false} className="p-2 w-full z-50">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>App</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<div className="p-2 rounded-lg flex flex-col gap-1">
									<h1 className="text-sm font-semibold">
										General
									</h1>
									<hr />
									<NavigationMenuLink asChild>
										<Link
											href="/"
											className="flex-row items-center gap-2"
										>
											<Ico
												src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
												className="invert opacity-60"
												size={15}
											/>
											Home
										</Link>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<Link
											href="/profile/view"
											className="flex-row items-center gap-2"
										>
											<Ico
												src="https://cdn-icons-png.flaticon.com/512/64/64572.png"
												className="invert opacity-60"
												size={18}
											/>
											profile
										</Link>
									</NavigationMenuLink>
								</div>
								<div className="p-2 rounded-lg flex flex-col gap-1">
									<h1 className="text-sm font-semibold">
										Decks
									</h1>
									<hr />
									<NavigationMenuLink asChild>
										<Link
											href="/decks/add-deck"
											className="flex-row items-center gap-2"
										>
											<Ico
												src="https://cdn-icons-png.flaticon.com/512/15665/15665179.png"
												className="invert opacity-60"
												size={18}
											/>
											Manage Decks
										</Link>
									</NavigationMenuLink>
								</div>
								<div className="p-2 rounded-lg flex flex-col gap-1">
									<h1 className="text-sm font-semibold">
										Account
									</h1>
									<hr />
									<NavigationMenuLink asChild>
										<div
											onClick={async () => {
												await signOut();
												router.replace("/auth");
											}}
											className="flex-row items-center gap-2 cursor-pointer"
										>
											<LogOutIcon />
											Log Out
										</div>
									</NavigationMenuLink>
								</div>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>
						Access Management
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link
										href="/access-control/roles"
										className="flex-row items-center gap-2"
									>
										<Ico
											src="	https://cdn-icons-png.flaticon.com/128/1769/1769328.png"
											className="invert opacity-60"
											size={15}
										/>
										roles
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="/access-control/permissions"
										className="flex-row items-center gap-2"
									>
										<Ico
											src="	https://cdn-icons-png.flaticon.com/128/7542/7542245.png"
											className="invert opacity-60"
											size={18}
										/>
										Permissions
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="/access-control/role-permission-binding"
										className="flex-row items-center gap-2"
									>
										<Ico
											src="https://cdn-icons-png.flaticon.com/128/18508/18508503.png"
											className="invert opacity-60"
											size={18}
										/>
										Role Permission Binding
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Games</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link
										href="/games/tic-tac-toe"
										className="flex-row items-center gap-2"
									>
										<Ico
											src="https://cdn-icons-png.flaticon.com/512/18947/18947706.png"
											className="invert"
											size={18}
										/>
										Tic Tac Toe
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}