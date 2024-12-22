import { PrimitiveUserRoleSelect } from "@/app/_components/selects/primitive-user-role-select";
import { TrashSvgIcon } from "@/app/_components/svg-icons/ui/trash-svg-icon";
import { Button } from "@/app/_components/ui/button";
import { formatDate } from "@/app/_utils/date-format-utils";
import { PeriodEditorStatusSelector } from "@/app/user-dashboard/profile/[userId]/[role]/components/periods-editor-dialog/period-editor-status-selector";
import { UserRole, type Period, type PeriodStatus } from "@prisma/client";

interface PeriodEditRowProps {
	period: Period;
	setProposedPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
	canDeletePeriod: boolean;
}

export function PeriodEditRow({
	period,
	setProposedPeriods,
	canDeletePeriod,
}: PeriodEditRowProps) {
	console.log(formatDate(period.startDate));
	
	function applyChange(change: (prev: Period) => Period) {
		setProposedPeriods((prev) => {
			const affectedPeriodIndex = prev.findIndex((curr) => curr === period);
			
			if (!prev[affectedPeriodIndex]) {
				return prev;
			}
			
			prev[affectedPeriodIndex] = {
				...prev[affectedPeriodIndex],
			};
			prev[affectedPeriodIndex] = change(prev[affectedPeriodIndex]);
			
			return [ ...prev ];
		});
	}
	
	function handleStartDateChange(event: React.ChangeEvent<HTMLInputElement>) {
		const selectedDate = event.currentTarget.value;
		applyChange(
			(prev) => {
				prev.startDate = new Date(selectedDate);
				
				return prev;
			}
		);
	}
	
	function handleRoleChange(nextRole: UserRole) {
		applyChange(
			(prev) => {
				prev.role = nextRole;
				
				return prev;
			}
		);
	}
	
	function handleStatusChange(nextStatus: PeriodStatus) {
		applyChange(
			(prev) => {
				prev.status = nextStatus;
				
				return prev;
			}
		);
	}
	
	function handleDescriptionChange(nextDescription: string) {
		applyChange(
			(prev) => {
				if (nextDescription.trim() === "") {
					prev.description = null;
				} else {
					prev.description = nextDescription;
				}
				
				return prev;
			}
		);
	}
	
	function deletePeriod() {
		setProposedPeriods((prev) => {
			const periodIndex = prev.findIndex((curr) => curr === period);
			
			const isLastPeriod = periodIndex === prev.length - 1;
			
			// If we delete the last period, we want the one period before it to inherit the end date of the deleted period
			// So the retire date isn't messed up
			if (isLastPeriod) {
				const newLastPeriod = prev[prev.length - 2];
				// Both periods cannot be null because deletion is only enabled
				// if there are at least 2 periods
				newLastPeriod!.endDate = prev[prev.length - 1]!.endDate;
			}
			
			return prev.toSpliced(periodIndex, 1);
		});
	}
	
	return (
		<tr>
			<td>
				<input
					type="date"
					value={formatDate(period.startDate)}
					onChange={handleStartDateChange}
				/>
			</td>
			<td>
				<PrimitiveUserRoleSelect
					availableRoles={Object.values(UserRole)}
					selectedRole={period.role}
					handleRoleChange={handleRoleChange}
				/>
			</td>
			<td>
				<PeriodEditorStatusSelector
					changeStatus={handleStatusChange}
					selectedStatus={period.status}
				/>
			</td>
			<td>
				<textarea
					defaultValue={period.description ?? ""}
					onBlur={(e) => {
						handleDescriptionChange(e.currentTarget.value);
					}}
				></textarea>
			</td>
			<td>
				<Button
					onClick={deletePeriod}
					className="size-10 p-0 text-xl [&_svg]:size-6"
					variant="ghost"
					disabled={!canDeletePeriod}
				>
					<TrashSvgIcon className="stroke-slate-600" />
				</Button >
			</td>
		</tr>
	);
};
