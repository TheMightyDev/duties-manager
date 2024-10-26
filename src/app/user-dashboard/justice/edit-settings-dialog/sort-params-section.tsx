import { usersJusticeTableColTitles } from "@/app/_utils/justice/users-justice-table-cols";
import { type RefObject } from "@fullcalendar/core/preact.js";

interface SortSettingsSectionParams {
	sortByColIdSelectRef: RefObject<HTMLSelectElement>;
	isAscendingInputRef: RefObject<HTMLInputElement>;
}

export function SortSettingsSection({
	sortByColIdSelectRef,
	isAscendingInputRef,
}: SortSettingsSectionParams) {
	const IS_ASCENDING_INPUT_ID = "sort-users-justice-ascending";
	
	return (
		<>
			<select ref={sortByColIdSelectRef}>
				{
					Object.entries(usersJusticeTableColTitles).map(([ id, title ]) => (
						<option
							key={id}
							value={id}
						>
							{title}
						</option>
					))
				}
			</select>
			<p>
				<input
					type="checkbox"
					id={IS_ASCENDING_INPUT_ID}
					ref={isAscendingInputRef}
				/>
				<label htmlFor={IS_ASCENDING_INPUT_ID}>
					סדר עולה
				</label>
			</p>
		</>
	);
};
