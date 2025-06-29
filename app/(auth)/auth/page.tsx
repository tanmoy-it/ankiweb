"use client";
import { signIn, signUp } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, MouseEvent, FC } from "react";

const MartianLogin: FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const handleSignIn = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		setLoading(true);
		setError("");
		signIn.email(
			{
				email,
				password,
				rememberMe: false,
			},
			{
				//callbacks
				onSuccess: (data) => {
					setLoading(false);
					router.replace("/");
				},
				onError: (error) => {
					setLoading(false);
					setError(
						error.error.message ||
							"An error occurred during sign in."
					);
				},
				onLoading: (loading: boolean) => {
					setLoading(loading);
					console.log("Loading state:", loading);
				},
			}
		);
	};

	const handleSignUp = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		setLoading(true);
		setError("");
		signUp.email(
			{
				email, // user email address
				password, // user password -> min 8 characters by default
				name: "martian", // user name -> optional
			},
			// callbacks
			{
				onRequest: (ctx) => {
					// you can use this to show a loading state
					setLoading(true);
					console.log("Sign up request initiated:", ctx);
					setError(""); // clear any previous error
				},
				onSuccess: (ctx) => {
					// handle successful sign up
					setLoading(false);

					router.replace("/");
				},
				onError: (ctx) => {
					// handle sign up error
					setLoading(false);
					setError(
						ctx.error.message || "An error occurred during sign up."
					);
				},
			}
		);
	};

	return (
		<div className="min-h-[700px] flex items-center justify-center bg-gradient-to-br from-stone-800 via-amber-900/50 to-orange-900/50 p-1 sm:p-2 lg:p-4 rounded-2xl">
			{/* Background stars - responsive positioning */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-1 h-1 bg-yellow-200 rounded-full opacity-60"></div>
				<div className="absolute top-20 right-16 sm:top-40 sm:right-32 w-1 h-1 bg-yellow-200 rounded-full opacity-40"></div>
				<div className="absolute bottom-20 left-20 sm:bottom-40 sm:left-40 w-1 h-1 bg-yellow-200 rounded-full opacity-70"></div>
				<div className="absolute top-32 left-1/3 sm:top-60 w-1 h-1 bg-yellow-200 rounded-full opacity-50"></div>
				<div className="absolute bottom-32 right-10 sm:bottom-60 sm:right-20 w-1 h-1 bg-yellow-200 rounded-full opacity-60"></div>
				<div className="absolute top-16 right-1/4 sm:top-32 w-1 h-1 bg-yellow-200 rounded-full opacity-30"></div>
				<div className="absolute bottom-10 left-1/4 sm:bottom-20 w-1 h-1 bg-yellow-200 rounded-full opacity-70"></div>
				<div className="absolute top-5 left-1/2 sm:top-10 w-1 h-1 bg-yellow-200 rounded-full opacity-50"></div>
				<div className="absolute top-40 right-20 sm:top-80 sm:right-40 w-1 h-1 bg-yellow-200 rounded-full opacity-40"></div>
				<div className="absolute bottom-40 left-30 sm:bottom-80 sm:left-60 w-1 h-1 bg-yellow-200 rounded-full opacity-60"></div>
			</div>

			<div className="relative bg-stone-900/20  backdrop-blur-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl h-auto min-h-[500px] sm:h-2/3 flex flex-col lg:flex-row  hover:scale-105 border-amber-500/30 transition-all duration-300 ease-in-out">
				{/* Left Panel - Martian Branding */}
				<div className="flex-1 bg-gradient-to-br from-stone-700/80 to-amber-800/80 relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[200px] lg:min-h-0">
					{/* Shooting stars - responsive */}
					<div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-4 sm:w-8 h-0.5 bg-yellow-200/40 transform rotate-45 opacity-50"></div>
					<div className="absolute bottom-10 right-8 sm:bottom-20 sm:right-16 w-3 sm:w-6 h-0.5 bg-yellow-200/30 transform rotate-12 opacity-40"></div>
					{/* Stars in left panel - responsive */}
					<div className="absolute top-8 right-10 sm:top-16 sm:right-20 w-1 h-1 bg-yellow-200 rounded-full opacity-60"></div>
					<div className="absolute bottom-16 left-8 sm:bottom-32 sm:left-16 w-1 h-1 bg-yellow-200 rounded-full opacity-40"></div>
					<div className="absolute top-1/3 left-1/4 w-1 h-1 bg-yellow-200 rounded-full opacity-70"></div>

					<div
						className={`w-28 h-28 sm:w-36 sm:h-36 lg:w-60 lg:h-60 rounded-full bg-gradient-to-br from-orange-600 via-red-600 to-red-800 relative mb-4 sm:mb-6 lg:mb-8 shadow-2xl overflow-hidden transition-transform duration-1000 ${loading ? "animate-spin" : ""}`}
					>
						<div className="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-sm"></div>

						<div className="absolute top-3 left-4 sm:top-5 sm:left-7 lg:top-8 lg:left-12 w-3 sm:w-5 lg:w-8 h-2 sm:h-3 lg:h-4 bg-red-800/60 rounded-full shadow-inner"></div>
						<div className="absolute bottom-4 right-3 sm:bottom-7 sm:right-5 lg:bottom-12 lg:right-8 w-2 sm:w-4 lg:w-6 h-1 sm:h-2 lg:h-3 bg-red-900/50 rounded-full shadow-inner"></div>
						<div className="absolute top-1/2 left-2 sm:left-4 lg:left-6 w-2 sm:w-3 lg:w-4 h-2 sm:h-4 lg:h-6 bg-orange-700/40 rounded-full shadow-inner"></div>

						<div className="absolute top-1/4 right-1/4 w-1.5 sm:w-2 lg:w-3 h-1.5 sm:h-2 lg:h-3 bg-red-900/60 rounded-full"></div>
						<div className="absolute bottom-1/3 left-1/3 w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 bg-orange-800/50 rounded-full"></div>
						<div className="absolute top-2/3 right-1/3 w-1.5 sm:w-2.5 lg:w-4 h-1 sm:h-1.5 lg:h-2 bg-red-800/40 rounded-full"></div>

						<div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 sm:w-3 lg:w-4 h-1 sm:h-1.5 lg:h-2 bg-white/20 rounded-full blur-[0.5px]"></div>
						<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 sm:w-2 lg:w-3 h-0.5 sm:h-1 lg:h-1.5 bg-white/15 rounded-full blur-[0.5px]"></div>

						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-red-700/20 to-red-900/30"></div>

						<div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 bg-gradient-to-br from-orange-400/30 to-transparent rounded-full blur-sm"></div>
					</div>

					{/* <Image src={"https://cdn-icons-png.flaticon.com/512/8606/8606016.png"} alt="Loading spinner plus just stuff" width={512} height={512} className={loading ? "animate-spin mb-4 w-70" : "mb-4 w-70"} /> */}

					{/* MARTIAN Text - responsive */}
					<h1 className="text-yellow-100 text-lg sm:text-xl lg:text-2xl font-light tracking-[0.2em] uppercase">
						<span className="text-amber-700">
							{loading
								? "Authenticating ..."
								: "LOG IN / SIGN UP"}
						</span>{" "}
						TO ANKI
					</h1>
				</div>

				{/* Right Panel - Login Form */}
				<div className="flex-1 bg-gradient-to-br from-amber-700/80 to-orange-700/80 p-2 sm:p-4 lg:p-6 flex flex-col justify-center relative min-h-[300px] lg:min-h-0">
					<h1 className="hidden md:block text-2xl text-center uppercase tracking-widest text-amber-200/20 mb-8">
						{loading ? "Identifying " : "Identify Yourself "}Human
						👽
					</h1>
					{/* Error Message */}
					{error && (
						<div className="text-sm mb-4 text-center bg-white/10 p-2 py-3 rounded-sm shadow-xl tracking-wider text-white border-1 opacity-90">
							{"⚠️ "}
							{error}
						</div>
					)}
					{/* Small decorative circle - responsive */}
					<form className="space-y-4 sm:space-y-6 w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0 lg:max-w-none">
						{/* Username Input */}
						<div>
							<input
								type="text"
								placeholder="Username"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className=" focus:shadow-xl w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-yellow-100/50 text-yellow-100 placeholder-yellow-100/70 focus:outline-none focus:border-yellow-100 transition-colors text-sm sm:text-base"
							/>
						</div>

						{/* Password Input */}
						<div>
							<input
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className=" focus:shadow-xl w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-yellow-100/50 text-yellow-100 placeholder-yellow-100/70 focus:outline-none focus:border-yellow-100 transition-colors text-sm sm:text-base"
							/>
						</div>

						<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
							<button
								type="submit"
								onClick={handleSignIn}
								className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 border border-yellow-100/50 text-yellow-100 bg-transparent hover:bg-yellow-100/10 hover:border-yellow-100 hover:shadow-md hover:shadow-yellow-100/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-yellow-100/50 disabled:hover:shadow-none disabled:hover:scale-100 transition-all duration-200 ease-in-out rounded-full cursor-pointer text-sm font-light tracking-wide transform hover:scale-[1.02]"
								disabled={loading}
							>
								{loading ? "Loading..." : "Log In"}
							</button>
							<button
								type="button"
								onClick={handleSignUp}
								className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 border border-yellow-100/50 text-yellow-100 bg-transparent hover:bg-yellow-100/10 hover:border-yellow-100 hover:shadow-md hover:shadow-yellow-100/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-yellow-100/50 disabled:hover:shadow-none disabled:hover:scale-100 transition-all duration-200 ease-in-out rounded-full cursor-pointer text-sm font-light tracking-wide transform hover:scale-[1.02]"
								disabled={loading}
							>
								Register
							</button>
						</div>

						{/* Forgot Password */}
						<div className="pt-3 sm:pt-4 text-center sm:text-left">
							<button
								type="button"
								className="text-yellow-100/80 hover:text-yellow-100 text-sm underline font-light tracking-wide"
							>
								Forgot Password?
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default MartianLogin;
