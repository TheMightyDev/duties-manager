import { type UserRole } from "@prisma/client";
import { type RefObject } from "react";

interface UserRolesSelectorProps {
	rolesCheckboxRefs: Record<UserRole, RefObject<HTMLInputElement>>;
}

export function UserRolesSelector({ rolesCheckboxRefs }: UserRolesSelectorProps) {
	return (
		<>
			{
				Object.entries(rolesCheckboxRefs).map(([ role, ref ]) => {
					const INPUT_ID = `justice-user-role-${role}`;
					
					return (
						<p>
							<input
								type="checkbox"
								id={INPUT_ID}
								ref={ref}
							/>
							<label htmlFor={INPUT_ID}>
								{role}
							</label>
						</p>);
				})
			}
		</>
	);
};
