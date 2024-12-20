"use client";

import { AssignmentsFilterRuleSelect } from "@/app/user-dashboard/profile/[userId]/[role]/components/assignments-filter-rule-select";
import { DutyAssignmentsGroup } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments-group";
import { AssignmentsFilterRule } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { type UserWithAssignments } from "@/server/api/types/user-with-assignments";
import { DutyKind } from "@prisma/client";
import { useMemo, useState } from "react";

interface DutyAssignmentsProps {
	assignments: UserWithAssignments["assignments"];
}

export function DutyAssignments({ assignments }: DutyAssignmentsProps) {
	const [ selectedFilterRule, setSelectedFilterRule ] = useState(AssignmentsFilterRule.ALL);

	const currentDate = new Date();
	
	const orderEarliestAssignmentsFirst = (a: UserWithAssignments["assignments"][0], b: UserWithAssignments["assignments"][0]) => (
		a.duty.startDate.getTime() - b.duty.startDate.getTime()
	);
	
	const checkIfDutyOfDesiredKind = (dutyKind: DutyKind): boolean => {
		switch (selectedFilterRule) {
			case AssignmentsFilterRule.ALL:
				return true;
			case AssignmentsFilterRule.GUARDING_ONLY:
				return dutyKind === DutyKind.GUARDING;
			case AssignmentsFilterRule.CAMP_OR_SETTLEMENT_DEFENSE:
				return dutyKind === DutyKind.CAMP_DEFENSE || dutyKind === DutyKind.SETTLEMENTS_DEFENSE;
			case AssignmentsFilterRule.MISC_DUTIES:
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
	), [ assignments, selectedFilterRule ]);
	
	const pastAssignments = useMemo(() => (
		assignments.filter((assignment) => (
			assignment.duty.startDate <= currentDate &&
			checkIfDutyOfDesiredKind(assignment.duty.kind)
		))
	), [ assignments, selectedFilterRule ]);
	
	return (
		<div className="relative flex w-full flex-col gap-2 p-2">
			{
				// If there are no visible assignments due to filter
				(
					futureAssignments.length === 0 &&
					pastAssignments.length === 0
				) &&
				<p className="text-center font-bold">
					אין שיבוצים להצגה
				</p>
			}
			{
				assignments.length > 0 &&
				<AssignmentsFilterRuleSelect
					selectedFilterRule={selectedFilterRule}
					handleFilterRuleChange={setSelectedFilterRule}
				/>
			}
			{
				futureAssignments.length > 0 &&
				<DutyAssignmentsGroup
					title="תורנויות עתידיות"
					assignments={futureAssignments}
				/>
			}
			{
				pastAssignments.length > 0 &&
				<DutyAssignmentsGroup
					title="תורנויות עבר"
					assignments={pastAssignments}
				/>
			}
		</div>
	);
};
