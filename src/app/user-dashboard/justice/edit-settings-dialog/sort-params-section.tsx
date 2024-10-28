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
	return (
		<>
			<label className="block">
				מיון לפי
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
			</label>
			<label>
				<input
					type="checkbox"
					ref={isAscendingInputRef}
				/>
				סדר עולה
			</label>
		</>
	);
};
