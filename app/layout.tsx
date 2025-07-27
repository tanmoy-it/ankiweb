import { NavBar } from "@/app/util-components/navbar";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";
import Ico from "./util-components/ico";
import UserLabel from "./util-components/user-label";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Anki Web",
	description: "Anki Web - A web-based version of Anki",
	icons: {
		icon: "https://cdn-icons-png.flaticon.com/512/2275/2275844.png",
	},
};

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
								<Suspense
									fallback={
										<div className="w-24 h-8 bg-gray-700 animate-pulse rounded-md" />
									}
								>
									<UserLabel />
								</Suspense>
							</div>
							<div className="p-3 px-30 w-full">{children}</div>
						</main>
					</div>
				</ThemeProvider>
				<Toaster richColors duration={3000} position="top-right" />
			</body>
		</html>
	);
}
