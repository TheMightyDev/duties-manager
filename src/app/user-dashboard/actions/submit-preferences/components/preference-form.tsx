"use client";

import { PrimitivePreferenceImportanceSelect } from "@/app/_components/selects/primitive-preference-importance-select";
import { PrimitivePreferenceKindSelect } from "@/app/_components/selects/primitive-preference-kind-select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import {
	PreferenceImportance,
	PreferenceKind,
	type Preference,
	type User,
} from "@prisma/client";
import { add, addMonths, endOfMonth } from "date-fns";
import { useTranslations } from "next-intl";
import {
	PreferenceImportanceSchema,
	PreferenceKindSchema,
} from "prisma/generated/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

type StartDateErrorMessageKey = "startDateTooEarly";
type EndDateErrorMessageKey = "endDateTooLate" | "endDateEarlier";

const DurationSchema = z.object({
	startDate: z.coerce.date().refine((data) => data > new Date(), {
		message: "startDateTooEarly",
	}),
	endDate: z.coerce
		.date()
		.refine((data) => new Date(data) <= endOfMonth(addMonths(new Date(), 1)), {
			message: "endDateTooLate",
		}),
});

const PREFERENCE_DESCRIPTION_MIN_LENGTH = 4;

const SubmitPreferenceSchema = DurationSchema.extend({
	importance: PreferenceImportanceSchema,
	kind: PreferenceKindSchema,
	description: z.string(),
})
	.refine((data) => new Date(data.endDate) > new Date(data.startDate), {
		message: "endDateEarlier",
		path: ["endDate"],
	})
	.refine(
		(data) =>
			data.importance !== PreferenceImportance.PREFERS
				? data.description &&
					data.description.trim().length >= PREFERENCE_DESCRIPTION_MIN_LENGTH
				: true,
		{
			message: "preferenceDescriptionMissing",
			path: ["description"],
		},
	);

type SubmitPreferenceType = z.infer<typeof SubmitPreferenceSchema>;

interface PreferenceFormProps {
	startDate: Date;
	endDate: Date;
	userId: User["id"];
	createPreference: (newPreference: Preference) => void;
	// preference: Preference;
}

export function PreferenceForm(props: PreferenceFormProps) {
	const form = useForm<SubmitPreferenceType>({
		resolver: zodResolver(SubmitPreferenceSchema),
		defaultValues: {
			startDate: new Date(),
			endDate: new Date(),
			importance: PreferenceImportance.CANT,
			kind: PreferenceKind.APPOINTMENT,
			description: "",
		},
	});

	const t = useTranslations();

	const selectedImportance = form.watch("importance");

	const { handleSubmit, formState } = form;

	useEffect(() => {
		if (props.startDate && props.endDate) {
			form.reset({
				startDate: props.startDate,
				endDate: props.endDate,
				importance: PreferenceImportance.CANT,
				kind: PreferenceKind.APPOINTMENT,
				description: "",
			});
		}
	}, [props.startDate, props.endDate]);

	console.log("@formState.errors", formState.errors);

	const onSubmit: SubmitHandler<SubmitPreferenceType> = (data) => {
		console.log("@submittedData", data);
		if (data.importance === PreferenceImportance.PREFERS) {
			data.kind = PreferenceKind.OTHER;
		}

		props.createPreference({
			id: createId(),
			userId: props.userId,
			...data,
			description: data.description,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} dir="rtl">
				<FormField
					control={form.control}
					name="startDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("General.start-date")}</FormLabel>
							<FormControl>
								<input
									{...field}
									type="date"
									value={
										field.value
											? field.value.toISOString().substring(0, 10)
											: ""
									}
									onChange={({ target: { value } }) =>
										field.onChange(value === "" ? undefined : new Date(value))
									}
								/>
							</FormControl>

							{form.formState.errors.startDate &&
								t(
									`PreferenceForm.Errors.${form.formState.errors.startDate.message as StartDateErrorMessageKey}`,
								)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="endDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("General.end-date")}</FormLabel>
							<FormControl>
								<input
									{...field}
									type="date"
									value={
										field.value
											? field.value.toISOString().substring(0, 10)
											: undefined
									}
									onChange={({ target: { value } }) =>
										field.onChange(
											value === ""
												? undefined
												: add(new Date(value), {
														days: 1,
														minutes: -1,
													}),
										)
									}
								/>
							</FormControl>
							{form.formState.errors.endDate &&
								t(
									`PreferenceForm.Errors.${form.formState.errors.endDate.message as EndDateErrorMessageKey}`,
								)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="importance"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("Preference.importance")}</FormLabel>
							<FormControl>
								<PrimitivePreferenceImportanceSelect
									currentValue={field.value}
									handleValueChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{selectedImportance !== PreferenceImportance.PREFERS && (
					<FormField
						control={form.control}
						name="kind"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("Preference.kind")}</FormLabel>
								<FormControl>
									<PrimitivePreferenceKindSelect
										currentValue={field.value}
										handleValueChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("Preference.description")}</FormLabel>
							<FormControl>
								<Input {...field} dir="rtl" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<input type="submit" />
			</form>
		</Form>
	);
}
