"use client";

import * as React from "react";
import Link from "next/link";
import {
	CircleCheckIcon,
	CircleHelpIcon,
	CircleIcon,
	EditIcon,
	EyeIcon,
	SettingsIcon,
	HelpCircleIcon,
	ImportIcon,
	DownloadIcon,
	LogOutIcon,
	UndoIcon,
	RedoIcon,
	ScissorsIcon,
	CopyIcon,
	ClipboardIcon,
	ZoomInIcon,
	ZoomOutIcon,
	MaximizeIcon,
	SidebarIcon,
	PuzzleIcon,
	BarChart3Icon,
	RefreshCwIcon,
	BookOpenIcon,
	KeyboardIcon,
	BugIcon,
	InfoIcon,
	MenuIcon,
	XIcon,
} from "lucide-react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
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
								<NavigationMenuLink asChild>
									<Link
										href="/"
										className="flex-row items-center gap-2"
									>
										<Ico src="https://cdn-icons.flaticon.com/svg/9239/9239733.svg?token=exp=1750928950~hmac=cc934adaa7edc39cb492da7330fee981" className="invert opacity-60" size={15} />
										Home
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="/profile/view"
										className="flex-row items-center gap-2"
									>
										<Ico src="https://cdn-icons.flaticon.com/svg/10786/10786343.svg?token=exp=1750928978~hmac=6937727667c0f5f00b398b557f7a9b10" className="invert opacity-60" size={18} />
										profile
									</Link>
								</NavigationMenuLink>
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
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Access Management</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link
										href="/access-control/roles"
										className="flex-row items-center gap-2"
									>
										<Ico src="https://cdn-icons.flaticon.com/svg/10404/10404999.svg?token=exp=1750863175~hmac=37837772c4dbefb8e361105bb238eedd" className="invert opacity-60" size={15} />
										roles
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="/access-control/permissions"
										className="flex-row items-center gap-2"
									>
										<Ico src="https://cdn-icons.flaticon.com/svg/10742/10742114.svg?token=exp=1750863522~hmac=4e1a2b5dde680185391368a4cfcb605e" className="invert opacity-60" size={18} />
										Permissions
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="/access-control/role-permission-binding"
										className="flex-row items-center gap-2"
									>
										<Ico src="https://cdn-icons.flaticon.com/svg/9844/9844441.svg?token=exp=1750863428~hmac=67620d1d43f022f56e0454de327b303c" className="invert opacity-60" size={18} />
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
										<Ico src="https://cdn-icons-png.flaticon.com/512/18947/18947706.png" className="invert" size={18} />
										Tic Tac Toe
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<ZoomOutIcon />
										Zoom Out
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<MaximizeIcon />
										Full Screen
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<SidebarIcon />
										Toggle Sidebar
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Tools</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<SettingsIcon />
										Preferences
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<PuzzleIcon />
										Add-ons
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<BarChart3Icon />
										Statistics
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<RefreshCwIcon />
										Sync
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Help</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<BookOpenIcon />
										Documentation
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<KeyboardIcon />
										Keyboard Shortcuts
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<BugIcon />
										Report Bug
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										href="#"
										className="flex-row items-center gap-2"
									>
										<InfoIcon />
										About
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

function ListItem({
	title,
	children,
	href,
	...props
}: {
	title: string;
	children: React.ReactNode;
	href: string;
} & React.HTMLAttributes<HTMLLIElement>) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">
						{title}
					</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
