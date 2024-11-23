import { type SvgIconProps } from "@/app/_components/svg-icons/common-svg-icon-props";
import { CommanderSvgIcon } from "@/app/_components/svg-icons/user-roles/commander-svg-icon";
import { ExemptSvgIcon } from "@/app/_components/svg-icons/user-roles/exempt-svg-icon";
import { OfficerSvgIcon } from "@/app/_components/svg-icons/user-roles/officer-svg-repo";
import { SquadSvgIcon } from "@/app/_components/svg-icons/user-roles/squad-svg-icon";
import { cn } from "@/app/_utils/cn";
import { UserRole } from "@prisma/client";
import clsx from "clsx";
import { type RefObject } from "react";

interface UserRolesSelectorProps {
	rolesCheckboxRefs: Record<UserRole, RefObject<HTMLInputElement>>;
	handleRolesSelectionChange?: (nextSelectedRoles: UserRole[]) => void;
	defaultCheckedRole?: UserRole;
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

const roleIcons: Record<UserRole, (params: SvgIconProps) => React.ReactNode> = {
	[UserRole.SQUAD]: SquadSvgIcon,
	[UserRole.OFFICER]: OfficerSvgIcon,
	[UserRole.COMMANDER]: CommanderSvgIcon,
	[UserRole.EXEMPT]: ExemptSvgIcon,
};

// size-5 md:size-6
export function UserRolesSelector(props: UserRolesSelectorProps) {
	function onContainerChange() {
		const selectedRoles = Object.entries(props.rolesCheckboxRefs)
			.filter(([ _, ref ]) => ref.current?.checked)
			.map(([ role ]) => role as UserRole);
		
		props.handleRolesSelectionChange?.(selectedRoles);
	}
	
	return (
		<>
			<h4>תפקידים</h4>
			<div
				className="md:flex md:gap-1"
				onChange={onContainerChange}
			>
				{
					Object.entries(props.rolesCheckboxRefs).map(([ role, ref ]) => {
						const iconObj = {
							icon: roleIcons[role as UserRole],
						};

						return (
							<label
								className={cn(
									"relative block py-1 has-[:checked]:text-white has-[:checked]:ring-indigo-500 md:size-9 md:cursor-pointer md:rounded-xl md:text-center bg-white hover:brightness-90", onCheckClassNames[role as UserRole]
								)}
								key={`justice-user-role-${role}`}
							>
								<input
									type="checkbox"
									ref={ref}
									defaultChecked={props.defaultCheckedRole === role}
									className={clsx(
										"-bottom-1 -end-1 inline-block accent-green-600  md:absolute",
										accentClassNames[role as UserRole]
									)}
								/>
								<iconObj.icon className="size-5 md:size-6" />
								<span className="inline-block md:hidden">
									{role}
								</span>
							</label>
						);
					})
				}
			</div>
		</>
	);
};
