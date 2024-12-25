"use client";

import { PrimitiveUserRankSelect } from "@/app/_components/selects/primitive-user-rank-select";
import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/_components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { formatDate } from "@/app/_utils/date-format-utils";
import { userBasicInfoFormSchema } from "@/types/forms/user-basic-info-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type User, type UserRank } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

interface UserInfoEditorDialogProps {
	user: User;
	updateUserInfo: (updatedInfo: z.infer<typeof userBasicInfoFormSchema>) => Promise<void>;
}

export function UserInfoEditorDialog({
	user,
	updateUserInfo,
}: UserInfoEditorDialogProps) {
	const [ isOpen, setIsOpen ] = useState(false);
	const form = useForm<z.infer<typeof userBasicInfoFormSchema>>({
		resolver: zodResolver(userBasicInfoFormSchema),
		defaultValues: {
			...user,
		},
	});
	
	const router = useRouter();

	function handleCancel() {
		setIsOpen(false);
	}
	
	function onSubmit(values: z.infer<typeof userBasicInfoFormSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		if (values.adminNote?.trim() === "") {
			values.adminNote = null;
		}
		
		updateUserInfo(values)
			.then(() => {
				router.refresh();
			});
			
		setIsOpen(false);
	}
	
	return (
		<>
			<Dialog
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<DialogTrigger>
					<PenLineSvgIcon className="size-5 stroke-black"/>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-center">
							עדכון פרטי משתמש
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
										<FormItem aria-description="שם פרטי">
											<FormLabel>שם פרטי</FormLabel>
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
										<FormItem aria-description="שם המשפחה">
											<FormLabel>שם משפחה</FormLabel>
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
										<FormItem aria-description="דרגה">
											<FormLabel>דרגה</FormLabel>
											<FormControl>
												<PrimitiveUserRankSelect
													defaultSelectedRank={field.value as UserRank}
													handleRankChange={field.onChange}
												/>
											</FormControl> <FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phoneNumber"
									render={({ field }) => (
										<FormItem aria-description="שם המשפחה">
											<FormLabel>מס' טלפון</FormLabel>
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
										<FormItem aria-description="שם המשפחה">
											<FormLabel>מגדר</FormLabel>
											<FormControl dir="ltr">
												<Input
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="permanentEntryDate"
									render={({ field }) => (
										<FormItem aria-description="שם המשפחה">
											<FormLabel>תאריך כניסה לקבע</FormLabel>
											<FormControl dir="ltr">
												<Input
													{...field}
													value={user.permanentEntryDate ? formatDate(user.permanentEntryDate) : ""}
													type="date"
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
										<FormItem aria-description="שם המשפחה">
											<FormLabel>הערה לסגל הניהול</FormLabel>
											<FormControl>
												<Input
													{...field}
													value={field.value ?? ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="button"
									variant="ghost"
									onClick={handleCancel}
								>
									ביטול
								</Button>
								<Button type="submit">שמירת השינויים</Button>
							</form>
						</Form>
					</DialogHeader>
					<DialogDescription>עריכת הפרטים האישיים של המשתמש</DialogDescription>
				</DialogContent>
			</Dialog>
		</>
	);
};
