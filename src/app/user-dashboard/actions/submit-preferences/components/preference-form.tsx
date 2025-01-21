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
import {
	type DatesSelection,
	type GetPreferenceParams,
} from "@/app/user-dashboard/types";
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
import React, { useEffect } from "react";
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
	datesSelection: DatesSelection;
	setDatesSelection: React.Dispatch<React.SetStateAction<DatesSelection>>;
	userId: User["id"];
	isOpen: boolean;
	createPreference: (newPreference: Preference) => void;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
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
		if (props.datesSelection) {
			form.reset({
				startDate: props.datesSelection.start,
				endDate: props.datesSelection.end,
				importance: PreferenceImportance.CANT,
				kind: PreferenceKind.APPOINTMENT,
				description: "",
			});
		}
	}, [props.isOpen]);

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

	// TODO: Extend to check no overlapping with any event (not just preference)
	// TODO: Adjust form to overlapping with an existing event
	const validateNoEventOverlap = (datesSelection: DatesSelection) => {
		const existingPreference = props.getPreference({
			datesSelection,
			excludedPreferenceId: "placeholder",
		});

		if (existingPreference) {
			form.setError("endDate", {
				message: "overlapping",
			});
		} else {
			form.clearErrors("endDate");
		}
	};

	useEffect(() => {
		validateNoEventOverlap(props.datesSelection);
	}, [props.datesSelection]);

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
									onChange={({ target: { value } }) => {
										const nextValue =
											value === "" ? undefined : new Date(value);

										if (nextValue) {
											props.setDatesSelection((prev) => {
												const next: DatesSelection = {
													...prev,
													start: nextValue,
												};

												return next;
											});
										}

										field.onChange(nextValue);
									}}
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
									onChange={({ target: { value } }) => {
										const nextValue =
											value === ""
												? undefined
												: add(new Date(value), {
														days: 1,
														minutes: -1,
													});

										if (nextValue) {
											props.setDatesSelection((prev) => {
												const next: DatesSelection = {
													...prev,
													end: nextValue,
												};

												return next;
											});
										}
										field.onChange(nextValue);
									}}
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
