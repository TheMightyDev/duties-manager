import { userRoleIcons } from "@/app/_components/svg-icons/user-roles/user-role-icons";
import { cn } from "@/app/_utils/cn";
import { UserRole } from "@prisma/client";
import clsx from "clsx";
import { type RefObject } from "react";

interface UserRolesSelectorProps {
	rolesCheckboxRefs: Record<UserRole, RefObject<HTMLInputElement>>;
	handleRolesSelectionChange?: (nextSelectedRoles: UserRole[]) => void;
	defaultCheckedRoles?: UserRole[];
}

const accentClassNames: Record<UserRole, string> = {
	[UserRole.SQUAD]: "accent-role-squad",
	[UserRole.OFFICER]: "accent-role-officer",
	[UserRole.COMMANDER]: "accent-role-commander",
	[UserRole.EXEMPT]: "accent-role-exempt",
};

const onCheckClassNames: Record<UserRole, string> = {
	[UserRole.SQUAD]: "has-[:checked]:bg-role-squad",
	[UserRole.OFFICER]: "has-[:checked]:bg-role-officer",
	[UserRole.COMMANDER]: "has-[:checked]:bg-role-commander",
	[UserRole.EXEMPT]: "has-[:checked]:bg-role-exempt",
};

// size-5 sm:size-6
export function UserRolesSelector(props: UserRolesSelectorProps) {
	function onContainerChange() {
		const selectedRoles = Object.entries(props.rolesCheckboxRefs)
			.filter(([ _, ref ]) => ref.current?.checked)
			.map(([ role ]) => role as UserRole);
		
		props.handleRolesSelectionChange?.(selectedRoles);
	}
	
	return (
		<div>
			<h4>תפקידים</h4>
			<div
				className="sm:flex sm:gap-1"
				onChange={onContainerChange}
			>
				{
					Object.entries(props.rolesCheckboxRefs).map(([ role, ref ]) => {
						const iconObj = {
							icon: userRoleIcons[role as UserRole],
						};

						return (
							<label
								className={cn(
									"group relative block py-1 has-[:checked]:text-white has-[:checked]:ring-indigo-500 sm:size-9 sm:cursor-pointer sm:rounded-xl sm:text-center bg-white hover:brightness-90", onCheckClassNames[role as UserRole]
								)}
								key={`justice-user-role-${role}`}
							>
								<input
									type="checkbox"
									ref={ref}
									defaultChecked={props.defaultCheckedRoles?.includes(role as UserRole)}
									className={clsx(
										"-bottom-1 -end-1 inline-block accent-green-600  sm:absolute",
										accentClassNames[role as UserRole]
									)}
								/>
								<iconObj.icon className="size-5 sm:size-6" />
								<span className="inline-block sm:hidden">
									{role}
								</span>
								<div
									role="tooltip"
									className="absolute left-1/2 top-full z-10 mt-2 hidden w-max -translate-x-1/2 rounded bg-slate-500 px-2 py-1 text-xs text-white sm:group-hover:block"
								>
									{role}
									<div className="absolute bottom-full left-1/2 size-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-slate-500"></div>
								</div>
							</label>
						);
					})
				}
			</div>
		</div>
	);
};
