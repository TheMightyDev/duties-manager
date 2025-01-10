"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { PreferenceImportance, PreferenceKind, type Preference, type User } from "@prisma/client";
import { add } from "date-fns";
import { PreferenceImportanceSchema, PreferenceKindSchema } from "prisma/generated/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const DurationSchema = z
	.object({
		startDate: z.coerce.date().refine((data) => new Date(data) > new Date(), {
			message: "startDateTooEarly",
		}),
		endDate: z.coerce.date(),
	});
	
const PREFERENCE_DESCRIPTION_MIN_LENGTH = 4;

const SubmitPreferenceSchema =
	DurationSchema.extend({
		importance: PreferenceImportanceSchema,
		kind: PreferenceKindSchema,
		description: z.string().optional(),
	})
		.refine(
			(data) => new Date(data.endDate) > new Date(data.startDate), {
				message: "endDateEarlier",
				path: [ "endDate" ],
			}
		)
		.refine(
			(data) =>
				data.importance !== PreferenceImportance.PREFERS
					? data.description && data.description.trim().length >= PREFERENCE_DESCRIPTION_MIN_LENGTH
					: true,
			{
				message: "preferenceDescriptionMissing",
				path: [ "description" ],
			}
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
		},
	});
	
	const { handleSubmit, formState } = form;
	
	useEffect(() => {
		if (props.startDate && props.endDate) {
			form.reset({
			// Error `startDate` is expected to be `Date`
				startDate: props.startDate,
				// No error, but `endDate` isn't visible on input
				endDate: props.endDate,
				importance: PreferenceImportance.CANT,
				kind: PreferenceKind.APPOINTMENT,
				description: "wowie",
			});
		}
	}, [ props.startDate, props.endDate ]);
	
	console.log("@formState.errors", formState.errors);
	
	const onSubmit: SubmitHandler<SubmitPreferenceType> = (data) => {
		console.log("@submittedData", data);
		props.createPreference({
			id: createId(),
			userId: props.userId,
			...data,
			description: data.description ?? "",
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="startDate"
					render={({ field }) => (
						<FormItem aria-describedby="התחלת תאריך">
							<FormLabel>התחלת תאריך</FormLabel>
							<FormControl>
								<input
									{...field}
									type="date"
									value={field.value ? field.value.toISOString().substring(0, 10) : ""}
									onChange={( { target: { value } } ) => field.onChange( value === "" ? undefined : new Date(value) ) }
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				
				<FormField
					control={form.control}
					name="endDate"
					render={({ field }) => (
						<FormItem aria-describedby="תאריך סיום">
							<FormLabel>תאריך סיום</FormLabel>
							<FormControl>
								<input
									{...field}
									type="date"
									value={field.value ? field.value.toISOString().substring(0, 10) : undefined}
									onChange={( { target: { value } } ) => field.onChange( value === "" ? undefined : add(new Date(value), {
										days: 1,
										minutes: -1,
									}))}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
					
				<input type="submit" />
			</form>
		</Form>
	);
};
