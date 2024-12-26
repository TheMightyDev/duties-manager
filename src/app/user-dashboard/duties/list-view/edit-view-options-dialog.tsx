import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/app/_components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { StartMonthSelect } from "@/app/user-dashboard/duties/list-view/start-month-select";
import { DutiesSelectOptionsSchema, type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

interface EditViewOptionsDialogProps {
	viewOptions: DutiesSelectOptions;
	changeViewOptions: (nextOptions: DutiesSelectOptions) => void;
}

export function EditViewOptionsDialog(props: EditViewOptionsDialogProps) {
	const form = useForm<z.infer<typeof DutiesSelectOptionsSchema>>({
		resolver: zodResolver(DutiesSelectOptionsSchema),
		defaultValues: props.viewOptions,
	});
	
	const [ isOpen, setIsOpen ] = useState(false);
	const t = useTranslations();
	
	console.log(form.formState);
	
	function resetFormToActualValues() {
		form.setValue("kinds", props.viewOptions.kinds);
		form.setValue("requiredUserRoles", props.viewOptions.requiredUserRoles);
		form.setValue("startMonthIndex", props.viewOptions.startMonthIndex);
		form.setValue("startYear", props.viewOptions.startYear);
	}
	
	function cancelSubmit() {
		resetFormToActualValues();
		setIsOpen(false);
	}
	
	function onSubmit(values: z.infer<typeof DutiesSelectOptionsSchema>) {
		console.log("@values", values);
		props.changeViewOptions({
			...values,
		});
		
		setIsOpen(false);
	}
	
	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger>
				<PenLineSvgIcon className="size-5 stroke-black"/>
			</DialogTrigger>
				
			<DialogContent>
				<DialogTitle>שינוי תצוגה</DialogTitle>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-2"
						dir="rtl"
					>
						<div className="flex flex-row">
							<FormField
								control={form.control}
								name="startYear"
								render={({ field }) => (
									<FormItem aria-description="שם פרטי">
										<FormLabel>שנה</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="startMonthIndex"
								render={({ field }) => (
									<FormItem aria-description="אינדקס חודש">
										<FormLabel>מספר חודש</FormLabel>
										<FormControl>
											<StartMonthSelect
												currentSelectedMonth={field.value}
												handleMonthChange={field.onChange}
												hasNoMonthOption={true}
											/>
											{/* <Input
											{...field}
											value={field.value ?? ""}
										/> */}
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Button
							type="button"
							variant="ghost"
							onClick={cancelSubmit}
						>
							ביטול
						</Button>
						<Button type="submit">שמירת השינויים</Button>
					</form>
					
				</Form>
				<DialogDescription>hhh</DialogDescription>

			</DialogContent>
		</Dialog>
	);
};
