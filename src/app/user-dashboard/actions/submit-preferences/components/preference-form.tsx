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
import { type GetPreferenceParams } from "@/app/user-dashboard/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import {
	PreferenceImportance,
	PreferenceKind,
	type Preference,
	type User,
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
	datesSelection: z.object({
		start: z.coerce.date().refine((data) => data > new Date(), {
			message: "startDateTooEarly",
		}),
		end: z.coerce
			.date()
			.refine(
				(data) => new Date(data) <= endOfMonth(addMonths(new Date(), 1)),
				{
					message: "endDateTooLate",
				},
			),
	}),
});

const PREFERENCE_DESCRIPTION_MIN_LENGTH = 4;

const SubmitPreferenceSchema = DurationSchema.extend({
	importance: PreferenceImportanceSchema,
	kind: PreferenceKindSchema,
	description: z.string(),
})
	.refine(
		(data) =>
			new Date(data.datesSelection.end) > new Date(data.datesSelection.start),
		{
			message: "endDateEarlier",
			path: ["datesSelection.end"],
		},
	)
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
	/** The info about an existing preference (on edit), or placeholder data about a
	 * preference that's about to be created (on add)
	 */
	initialPreferenceData: Preference;
	userId: User["id"];
	isOpen: boolean;
	closeDialog: () => void;
	createPreference: (newPreference: Preference) => void;
	getPreference: (params: GetPreferenceParams) => Preference | undefined;
}

export function PreferenceForm(props: PreferenceFormProps) {
	const form = useForm<SubmitPreferenceType>({
		resolver: zodResolver(
			// TODO: Extend to check no overlapping with any event (not just preference)
			// TODO: Adjust form to overlapping with an existing event
			SubmitPreferenceSchema.refine(
				(arg) => {
					const existingPreference = props.getPreference({
						datesSelection: arg.datesSelection,
						excludedPreferenceId: "new-preference",
					});

					console.log("@existingPreference", existingPreference);

					return existingPreference === undefined;
				},
				{
					message: "overlapping",
					path: ["datesSelection.root"],
				},
			),
		),
		defaultValues: {
			datesSelection: {
				start: props.initialPreferenceData.startDate,
				end: props.initialPreferenceData.endDate,
			},
			...props.initialPreferenceData,
		},
		mode: "onBlur",
	});

	const t = useTranslations();

	const selectedImportance = form.watch("importance");

	const { handleSubmit, formState } = form;

	useEffect(() => {
		form.reset({
			datesSelection: {
				start: props.initialPreferenceData.startDate,
				end: props.initialPreferenceData.endDate,
			},
			...props.initialPreferenceData,
		});
	}, [props.initialPreferenceData]);

	useEffect(() => {}, [props.isOpen]);

	console.log("@formState.errors", formState.errors);

	const onSubmit: SubmitHandler<SubmitPreferenceType> = (submittedData) => {
		console.log("@submittedData", submittedData);
		if (submittedData.importance === PreferenceImportance.PREFERS) {
			submittedData.kind = PreferenceKind.OTHER;
		}

		props.createPreference({
			id: createId(),
			userId: props.userId,
			startDate: submittedData.datesSelection.start,
			endDate: submittedData.datesSelection.end,
			importance: submittedData.importance,
			kind: submittedData.kind,
			description: submittedData.description,
		});
	};

	return (
		<Form {...form}>
			<div>
				<button
					onClick={() => {
						props.closeDialog();
					}}
				>
					<X />
				</button>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} dir="rtl">
				<FormField
					control={form.control}
					name="datesSelection.start"
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
										// There's a bug with React Hook Form that errors found by zod schema violations aren't registered (even thought the check is made)
										form.trigger();
									}}
								/>
							</FormControl>

							{form.formState.errors.datesSelection &&
								t(
									`PreferenceForm.Errors.${form.formState.errors.datesSelection.root?.message as StartDateErrorMessageKey}`,
								)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="datesSelection.end"
					// rules={{
					// 	validate: {
					// 		endDate: (endDate, { startDate }) => {
					// 			const preference = props.getPreference({
					// 				datesSelection: {
					// 					start: startDate,
					// 					end: endDate,
					// 				},
					// 				excludedPreferenceId: "placeholder",
					// 			});

					// 			console.log("@preference", preference);

					// 			if (preference) {
					// 				return "ohohoh";
					// 			}

					// 			return "meow";
					// 		},
					// 	},
					// }}
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

										form.trigger();
									}}
								/>
							</FormControl>
							{form.formState.errors.datesSelection?.end?.message &&
								t(
									`PreferenceForm.Errors.${form.formState.errors.datesSelection?.end?.message as EndDateErrorMessageKey}`,
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
					<button onClick={props.closeDialog}>
						{t("FormInteractions.cancel")}
					</button>
					<input type="submit" value={t("FormInteractions.submit")} />
				</div>
			</form>
		</Form>
	);
}
