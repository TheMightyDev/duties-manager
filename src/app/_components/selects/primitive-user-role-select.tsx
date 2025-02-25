"use client";

import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/app/_components/ui/select";
import { getTextDirection } from "@/app/_utils/get-text-direction";
import { type UserRole } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale, useTranslations } from "next-intl";

interface PrimitiveUserRoleSelectProps {
	availableRoles: UserRole[];
	selectedRole: UserRole;
	handleRoleChange: (nextRole: UserRole) => void;
}

export function PrimitiveUserRoleSelect(props: PrimitiveUserRoleSelectProps) {
	function handleValueChange(nextRole: string) {
		props.handleRoleChange(nextRole as UserRole);
	}
	
	const locale = useLocale();
	const t = useTranslations();
		
	return (
		<>
			<DirectionProvider dir={getTextDirection(locale)}>
				<Select
					value={props.selectedRole}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="w-20">
						<UserRoleMark role={props.selectedRole} />
					</SelectTrigger>
					<SelectContent>
						{
							props.availableRoles.map((role) => {
								return (
									<SelectItem
										value={role}
										key={role}
									>
										<div className="flex flex-row items-center gap-2">
											<UserRoleMark
												role={role}
												hasTooltip={false}
											/>
											<span className="capitalize">
												{t(`UserRole.${role}`)}
											</span>
										</div>
									</SelectItem>
								);
							})
						}
					</SelectContent>
				</Select>
			</DirectionProvider>
		</>
	);
};
