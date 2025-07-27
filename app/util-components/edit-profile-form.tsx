"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { updateProfileAction } from "@/app/server-actions/pfractions";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	display_name: z.string().min(1, "Display name is required"),
	user_bio: z.string().optional(),
	date_of_birth: z.coerce.date(),
	gender: z.string().optional(),
	phone: z.string().optional(),
	location: z.string().optional(),
	website: z.string().optional(),
	profession: z.string().optional(),
	current_company_name: z.string().optional(),
	latest_education_degree: z.string().optional(),
});

interface EditProfileFormProps {
	defaultValues?: {
		first_name: string;
		last_name: string;
		display_name: string;
		user_bio: string;
		date_of_birth: Date;
		gender: string;
		phone: string;
		location: string;
		website: string;
		profession: string;
		current_company_name: string;
		latest_education_degree: string;
	};
}

export default function EditProfileForm({
	defaultValues,
}: EditProfileFormProps) {
	const [state, formAction, isPending] = useActionState(
		updateProfileAction,
		null
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {
			first_name: "",
			last_name: "",
			display_name: "",
			user_bio: "",
			date_of_birth: new Date(),
			gender: "",
			phone: "",
			location: "",
			website: "",
			profession: "",
			current_company_name: "",
			latest_education_degree: "",
		},
	});

	// Reset form when defaultValues change
	useEffect(() => {
		if (defaultValues) {
			form.reset(defaultValues);
		}
	}, [defaultValues, form]);

	// Handle server action response
	useEffect(() => {
		if (state?.success) {
			toast.success(state.message || "Profile updated successfully");
		} else if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<Form {...form}>
			<form action={formAction} className="space-y-8 max-w-full mx-auto">
				{state?.error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
						{state.error}
					</div>
				)}

				{state?.success && (
					<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
						{state.message}
					</div>
				)}

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-4">
						<FormField
							control={form.control}
							name="first_name"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={""}>
									<FormLabel className={""}>
										First Name
									</FormLabel>
									<FormControl>
										<Input
											className={""}
											placeholder=""
											type="text"
											name="first_name"
											defaultValue={field.value}
											onChange={field.onChange}
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-4">
						<FormField
							control={form.control}
							name="last_name"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={""}>
									<FormLabel className={""}>
										Last name
									</FormLabel>
									<FormControl>
										<Input
											className={""}
											placeholder=""
											type="text"
											name="last_name"
											defaultValue={field.value}
											onChange={field.onChange}
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-4">
						<FormField
							control={form.control}
							name="display_name"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={""}>
									<FormLabel className={""}>
										Display Name
									</FormLabel>
									<FormControl>
										<Input
											className={""}
											placeholder=""
											type="text"
											name="display_name"
											defaultValue={field.value}
											onChange={field.onChange}
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<FormField
					control={form.control}
					name="user_bio"
					// eslint-disable-next-line
					render={({ field }: { field: any }) => (
						<FormItem className={""}>
							<FormLabel className={""}>Bio</FormLabel>
							<FormControl>
								<Textarea
									placeholder=""
									className="resize-none"
									name="user_bio"
									defaultValue={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormDescription className={""}>
								Add a Bio
							</FormDescription>
							<FormMessage className={""} />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-6">
						<FormField
							control={form.control}
							name="date_of_birth"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className="flex flex-col">
									<FormLabel className={""}>
										Date of birth
									</FormLabel>
									<input
										type="hidden"
										name="date_of_birth"
										value={
											field.value
												? field.value.toISOString()
												: ""
										}
									/>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													size={"default"}
													variant={"outline"}
													type="button"
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value &&
															"text-muted-foreground"
													)}
												>
													{field.value ? (
														format(
															field.value,
															"PPP"
														)
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
										>
											<Calendar
												className={""}
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
												classNames={undefined}
												formatters={undefined}
												components={undefined}
											/>
										</PopoverContent>
									</Popover>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-6">
						<FormField
							control={form.control}
							name="gender"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={"w-full"}>
									<FormLabel className={""}>Gender</FormLabel>
									<input
										type="hidden"
										name="gender"
										value={field.value || ""}
									/>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger className={"w-full"}>
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className={""}>
											<SelectItem
												className={""}
												value="Male"
											>
												Male
											</SelectItem>
											<SelectItem
												className={""}
												value="Female"
											>
												Female
											</SelectItem>
											<SelectItem
												className={""}
												value="Other"
											>
												Other
											</SelectItem>
										</SelectContent>
									</Select>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-4">
						<FormField
							control={form.control}
							name="phone"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className={""}>
										Phone number
									</FormLabel>
									<input
										type="hidden"
										name="phone"
										value={field.value || ""}
									/>
									<FormControl className="w-full">
										<PhoneInput
											placeholder=""
											value={field.value}
											onChange={field.onChange}
											defaultCountry="TR"
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-4">
						<FormField
							control={form.control}
							name="location"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={""}>
									<FormLabel className={""}>
										Location
									</FormLabel>
									<FormControl>
										<Input
											className={""}
											placeholder=""
											type="text"
											name="location"
											defaultValue={field.value}
											onChange={field.onChange}
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-4">
						<FormField
							control={form.control}
							name="website"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={""}>
									<FormLabel className={""}>
										Website
									</FormLabel>
									<FormControl>
										<Input
											className={""}
											placeholder=""
											type="text"
											name="website"
											defaultValue={field.value}
											onChange={field.onChange}
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-6">
						<FormField
							control={form.control}
							name="profession"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={""}>
									<FormLabel className={""}>
										Profession
									</FormLabel>
									<FormControl>
										<Input
											className={""}
											placeholder=""
											type="text"
											name="profession"
											defaultValue={field.value}
											onChange={field.onChange}
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-6">
						<FormField
							control={form.control}
							name="current_company_name"
							// eslint-disable-next-line
							render={({ field }: { field: any }) => (
								<FormItem className={""}>
									<FormLabel className={""}>
										Current Company Name
									</FormLabel>
									<FormControl>
										<Input
											className={""}
											placeholder=""
											type="text"
											name="current_company_name"
											defaultValue={field.value}
											onChange={field.onChange}
										/>
									</FormControl>

									<FormMessage className={""} />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<FormField
					control={form.control}
					name="latest_education_degree"
					// eslint-disable-next-line
					render={({ field }: { field: any }) => (
						<FormItem className={""}>
							<FormLabel className={""}>
								Latest Education Degree
							</FormLabel>
							<FormControl>
								<Input
									className={""}
									placeholder=""
									type="text"
									name="latest_education_degree"
									defaultValue={field.value}
									onChange={field.onChange}
								/>
							</FormControl>

							<FormMessage className={""} />
						</FormItem>
					)}
				/>
				<Button
					size={"default"}
					className={""}
					variant={"default"}
					type="submit"
					disabled={isPending}
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Updating...
						</>
					) : (
						"Update Profile"
					)}
				</Button>
			</form>
		</Form>
	);
}
