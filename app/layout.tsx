import { NavBar } from "@/app/util-components/navbar";
import { ThemeProvider } from "next-themes";
import { Geist, Fira_Code } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/app/_lib/context-provider";
import { PenLineIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Ico from "./util-components/ico";
import UserLabel from "./util-components/user-label";
import localFont from "next/font/local";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Anki Web",
	description: "Anki Web - A web-based version of Anki",
	icons: {
		icon: "https://cdn-icons-png.flaticon.com/512/2275/2275844.png",
	},
};

const firaCode = localFont({
	src: "../public/fonts/FiraCode-Regular.ttf",
});

// roboto font
const geist = Geist({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-geist",
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user;

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geist.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="grid grid-cols-1 grid-rows-[auto_1fr_auto]">
						<main className="flex flex-col items-start justify-center">
							<div className="flex justify-between items-center px-3 w-full">
								<div className="flex items-center gap-4">
									<h3 className="text-lg font-bold text-white uppercase tracking-widest">
										Anki Web{" "}
										<Ico src="https://cdn-icons-png.flaticon.com/512/4693/4693393.png" />
									</h3>
									<NavBar />
								</div>
								<UserLabel />
							</div>
							<div className="p-3 px-30 w-full">
								<ContextProvider>{children}</ContextProvider>
							</div>
						</main>
					</div>
				</ThemeProvider>
				<Toaster richColors duration={3000} position="top-right" />
			</body>
		</html>
	);
}
