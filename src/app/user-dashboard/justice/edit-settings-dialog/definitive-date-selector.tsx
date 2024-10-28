import { DefinitiveDateKind } from "@/app/user-dashboard/justice/types";
import { type RefObject } from "react";

interface DefinitiveDateSelectorProps {
	kindSelectRef?: RefObject<HTMLSelectElement>;
	customDateInputRef?: RefObject<HTMLInputElement>;
}

export function DefinitiveDateSelector({
	kindSelectRef,
	customDateInputRef,
}: DefinitiveDateSelectorProps) {
	return (
		<>
			<label>
				תאריך קובע
				<select
					ref={kindSelectRef}
				>
					{
						Object.entries(DefinitiveDateKind).map(([ id, value ]) => {
							return (
								<option
									value={value}
									key={id}
								>
									{value}
								</option>
							);
						})
					}
				</select>
			</label>
			
			<p>
				<label>
					בחירה אישית
					<input
						type="date"
						ref={customDateInputRef}
					/>
				</label>
			</p>
		</>
	);
};
