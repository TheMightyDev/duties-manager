import { CommanderSvgIcon } from "@/app/_components/svg-icons/user-roles/commander-svg-icon";
import { ExemptSvgIcon } from "@/app/_components/svg-icons/user-roles/exempt-svg-icon";
import { OfficerSvgIcon } from "@/app/_components/svg-icons/user-roles/officer-svg-repo";
import { SquadSvgIcon } from "@/app/_components/svg-icons/user-roles/squad-svg-icon";
import { UserRole } from "@prisma/client";
import clsx from "clsx";
import { type ReactNode, type RefObject } from "react";

interface UserRolesSelectorProps {
	rolesCheckboxRefs: Record<UserRole, RefObject<HTMLInputElement>>;
	handleRolesSelectionChange?: (nextSelectedRoles: UserRole[]) => void;
}

const accentClassNames: Record<UserRole, string> = {
	[UserRole.SQUAD]: "accent-[#8843F2]",
	[UserRole.OFFICER]: "accent-[#59D5E0]",
	[UserRole.COMMANDER]: "accent-[#FAA300]",
	[UserRole.EXEMPT]: "accent-[#F4538A]",
};

const onCheckClassNames: Record<UserRole, string> = {
	[UserRole.SQUAD]: "has-[:checked]:bg-[#8843F2]",
	[UserRole.OFFICER]: "has-[:checked]:bg-[#59D5E0]",
	[UserRole.COMMANDER]: "has-[:checked]:bg-[#FAA300]",
	[UserRole.EXEMPT]: "has-[:checked]:bg-[#F4538A]",
};

const roleIcons: Record<UserRole, ReactNode> = {
	[UserRole.SQUAD]: <SquadSvgIcon className="size-5 md:size-6" />,
	[UserRole.OFFICER]: <OfficerSvgIcon className="size-5 md:size-6" />,
	[UserRole.COMMANDER]: <CommanderSvgIcon className="size-5 md:size-6" />,
	[UserRole.EXEMPT]: <ExemptSvgIcon className="size-5 md:size-6" />,
};

export function UserRolesSelector({
	rolesCheckboxRefs,
	handleRolesSelectionChange,
}: UserRolesSelectorProps) {
	function onContainerChange() {
		const selectedRoles = Object.entries(rolesCheckboxRefs)
			.filter(([ _, ref ]) => ref.current?.checked)
			.map(([ role ]) => role as UserRole);
		
		handleRolesSelectionChange?.(selectedRoles);
	}
	
	return (
		<>
			<h4>תפקידים</h4>
			<div
				className="md:flex md:gap-1"
				onChange={onContainerChange}
			>
				{
					Object.entries(rolesCheckboxRefs).map(([ role, ref ]) => {
						return (
							<label
								className={clsx(
									"relative block py-1 has-[:checked]:text-white has-[:checked]:ring-indigo-500 md:size-9 md:cursor-pointer md:rounded-xl md:text-center", onCheckClassNames[role as UserRole]
								)}
								key={`justice-user-role-${role}`}
							>
								<input
									type="checkbox"
									ref={ref}
									className={clsx(
										"-bottom-1 -end-1 inline-block accent-green-600  md:absolute",
										accentClassNames[role as UserRole]
									)}
								/>
								{roleIcons[role as UserRole]}
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
