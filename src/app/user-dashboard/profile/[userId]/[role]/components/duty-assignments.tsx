"use client";

import { DutyGroupKindSelect } from "@/app/user-dashboard/profile/[userId]/[role]/components/assignments-filter-rule-select";
import { DutyAssignmentsGroup } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments-group";
import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";
import { DutyGroupKind } from "@/types/duties/duty-group-kind";
import { DutyKind } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface DutyAssignmentsProps {
	assignments: UserWithAssignments["assignments"];
}

export function DutyAssignments({ assignments }: DutyAssignmentsProps) {
	const [ selectedDutyGroupKind, setSelectedDutyGroupKind ] = useState(DutyGroupKind.ALL);
	
	const t = useTranslations();

	const currentDate = new Date();
	
	const orderEarliestAssignmentsFirst = (a: UserWithAssignments["assignments"][0], b: UserWithAssignments["assignments"][0]) => (
		a.duty.startDate.getTime() - b.duty.startDate.getTime()
	);
	
	const checkIfDutyOfDesiredKind = (dutyKind: DutyKind): boolean => {
		switch (selectedDutyGroupKind) {
			case DutyGroupKind.ALL:
				return true;
			case DutyGroupKind.GUARDING_ONLY:
				return dutyKind === DutyKind.GUARDING;
			case DutyGroupKind.CAMP_OR_SETTLEMENT_DEFENSE:
				return dutyKind === DutyKind.CAMP_DEFENSE || dutyKind === DutyKind.SETTLEMENTS_DEFENSE;
			case DutyGroupKind.MISC_DUTIES:
				return dutyKind !== DutyKind.GUARDING &&
					dutyKind !== DutyKind.CAMP_DEFENSE &&
					dutyKind !== DutyKind.SETTLEMENTS_DEFENSE;
			default:
				return true;
		}
	};
	
	const futureAssignments = useMemo(() => (
		assignments
			.filter((assignment) => (
				assignment.duty.startDate > currentDate && checkIfDutyOfDesiredKind(assignment.duty.kind)
			))
			.sort(orderEarliestAssignmentsFirst)
	), [ assignments, selectedDutyGroupKind ]);
	
	const pastAssignments = useMemo(() => (
		assignments.filter((assignment) => (
			assignment.duty.startDate <= currentDate &&
			checkIfDutyOfDesiredKind(assignment.duty.kind)
		))
	), [ assignments, selectedDutyGroupKind ]);
	
	return (
		<div className="relative flex w-full flex-col gap-2 p-2">
			{
				assignments.length > 0 &&
				<DutyGroupKindSelect
					selectedGroupKind={selectedDutyGroupKind}
					handleGroupKindChange={setSelectedDutyGroupKind}
				/>
			}
			{
				// If there are no visible assignments due to filter
				(
					futureAssignments.length === 0 &&
					pastAssignments.length === 0
				) &&
				<p className="text-center font-bold">
					{t("Profile.no-assignments")}
				</p>
			}
			
			{
				futureAssignments.length > 0 &&
				<DutyAssignmentsGroup
					title={t("Profile.future-duties")}
					assignments={futureAssignments}
				/>
			}
			{
				pastAssignments.length > 0 &&
				<DutyAssignmentsGroup
					title={t("Profile.past-duties")}
					assignments={pastAssignments}
				/>
			}
		</div>
	);
};
