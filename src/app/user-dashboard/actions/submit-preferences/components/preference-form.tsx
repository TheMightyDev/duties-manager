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
import {
	PreferenceImportance,
	PreferenceKind,
	type Preference,
} from "@prisma/client";
import { add, addMonths, endOfMonth } from "date-fns";
import { X } from "lucide-react";
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
	.refine((data) => data.endDate > data.startDate, {
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

export interface PreferenceFormProps {
	/** The info about an existing preference (on edit), or placeholder data about a
	 * preference that's about to be created (on add)
	 */
	initialPreferenceData: Preference;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
	updateSelectedPreferenceDatesSelection: (
		nextDatesSelection: Partial<DatesSelection>,
	) => void;
	/** A callback that closes the dialog.
	 * If not provided, the button to close the dialog is not rendered
	 */
	closeDialog?: () => void;
	handleCancel: () => void;
	handleSubmit: (submittedData: SubmitPreferenceType) => void;
}

export function PreferenceForm(props: PreferenceFormProps) {
	const form = useForm<SubmitPreferenceType>({
		resolver: zodResolver(
			// TODO: Extend to check no overlapping with any event (not just preference)
			// TODO: Adjust form to overlapping with an existing event
			SubmitPreferenceSchema.refine(
				(arg) => {
					const existingPreference = props.getPreference({
						datesSelection: {
							start: arg.startDate,
							end: arg.endDate,
						},
						excludedPreferenceId: props.initialPreferenceData.id,
					});

					console.log("@existingPreference", existingPreference);

					return existingPreference === undefined;
				},
				{
					message: "overlapping",
					path: ["endDate"],
				},
			),
		),
		defaultValues: {
			...props.initialPreferenceData,
		},
		mode: "onBlur",
	});

	const t = useTranslations();

	const selectedImportance = form.watch("importance");

	useEffect(() => {
		form.resetField("startDate", {
			defaultValue: props.initialPreferenceData.startDate,
		});
		form.resetField("endDate", {
			defaultValue: props.initialPreferenceData.endDate,
		});
	}, [props.initialPreferenceData]);

	const onSubmit: SubmitHandler<SubmitPreferenceType> = (submittedData) => {
		if (submittedData.importance === PreferenceImportance.PREFERS) {
			submittedData.kind = PreferenceKind.OTHER;
		}
		props.handleSubmit(submittedData);
	};

	return (
		<Form {...form}>
			<div>
				{props.closeDialog && (
					<button
						onClick={() => {
							props.closeDialog?.();
						}}
					>
						<X />
					</button>
				)}
			</div>
			<form onSubmit={form.handleSubmit(onSubmit)} dir="rtl">
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

										field.onChange(nextValue);
										props.updateSelectedPreferenceDatesSelection({
											start: nextValue,
										});
										// There's a bug with React Hook Form that errors found by zod schema violations aren't registered (even thought the check is made)
										form.trigger();
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
										field.onChange(nextValue);
										props.updateSelectedPreferenceDatesSelection({
											end: nextValue,
										});

										form.trigger();
									}}
								/>
							</FormControl>
							{form.formState.errors.endDate?.message &&
								t(
									`PreferenceForm.Errors.${form.formState.errors.endDate?.message as EndDateErrorMessageKey}`,
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
				<div className="flex flex-row justify-end gap-1">
					<button onClick={props.handleCancel}>
						{t("FormInteractions.cancel")}
					</button>
					<input type="submit" value={t("FormInteractions.submit")} />
				</div>
			</form>
		</Form>
	);
}
