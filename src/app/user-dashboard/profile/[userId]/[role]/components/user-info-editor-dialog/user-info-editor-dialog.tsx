"use client";

import { PrimitiveUserRankSelect } from "@/app/_components/selects/primitive-user-rank-select";
import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { Button } from "@/app/_components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { UserBasicInfoFormSchema } from "@/types/forms/user-basic-info-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

interface UserInfoEditorDialogProps {
	user: User;
	updateUserInfo: (
		updatedInfo: z.infer<typeof UserBasicInfoFormSchema>,
	) => Promise<void>;
}

export function UserInfoEditorDialog({
	user,
	updateUserInfo,
}: UserInfoEditorDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<z.infer<typeof UserBasicInfoFormSchema>>({
		resolver: zodResolver(UserBasicInfoFormSchema),
		defaultValues: {
			...user,
			permanentEntryDate: user.permanentEntryDate,
		},
	});

	const router = useRouter();

	const t = useTranslations();

	const handleCancel = () => {
		setIsOpen(false);
	};

	const onSubmit = (values: z.infer<typeof UserBasicInfoFormSchema>) => {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		// if (values.adminNote?.trim() === "") {
		// 	values.adminNote = null;
		// }

		updateUserInfo(values).then(() => {
			router.refresh();
		});

		setIsOpen(false);
	};

	console.log("values", form.getValues("permanentEntryDate"), user);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger>
					<PenLineSvgIcon className="size-5 stroke-black" />
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-center">
							{t("UserInfoEditor.title")}
						</DialogTitle>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-2"
								dir="rtl"
							>
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("User.first-name")}</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("User.last-name")}</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="rank"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("User.rank")}</FormLabel>
											<FormControl>
												<PrimitiveUserRankSelect
													defaultValue={field.value}
													handleValueChange={field.onChange}
												/>
											</FormControl>{" "}
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phoneNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("User.phone-number")}</FormLabel>
											<FormControl dir="ltr">
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("User.gender")}</FormLabel>
											<FormControl dir="ltr">
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="permanentEntryDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("User.permanent-entry-date")}</FormLabel>
											<FormControl dir="ltr">
												<Input
													{...field}
													type="date"
													value={
														field.value
															? field.value.toISOString().substring(0, 10)
															: ""
													}
													onChange={({ target: { value } }) =>
														field.onChange(
															value === "" ? undefined : new Date(value),
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="adminNote"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("User.admin-note")}</FormLabel>
											<FormControl>
												<Input {...field} value={field.value ?? ""} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="button" variant="ghost" onClick={handleCancel}>
									{t("FormInteractions.cancel")}
								</Button>
								<Button type="submit">
									{t("FormInteractions.save-changes")}
								</Button>
							</form>
						</Form>
					</DialogHeader>
					<DialogDescription>
						{t("UserInfoEditor.description")}
					</DialogDescription>
				</DialogContent>
			</Dialog>
		</>
	);
}
