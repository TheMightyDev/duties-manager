"use client";

import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { getTextDirection } from "@/app/_utils/get-text-direction";
import { type RoleRecord } from "@/types/user/role-record";
import { type UserRole } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

interface ProfileRoleSelectorProps {
	roleRecords: RoleRecord[];
	selectedRole: UserRole;
}

export function ProfileRoleSelector(props: ProfileRoleSelectorProps) {
	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale();
	const t = useTranslations();
	
	function switchRoleInPathname(role: UserRole): string {
		const pathnameArray = pathname.split("/");
		const nextPathnameArray = pathnameArray.slice(0, pathnameArray.length - 1).concat(role);
		
		const nextPathname = nextPathnameArray.join("/");
		
		return nextPathname;
	}

	function handleValueChange(nextRole: string) {
		router.push(switchRoleInPathname(nextRole as UserRole));
	}
	
	return (
		<>
			<DirectionProvider dir={getTextDirection(locale)}>
				<Select
					value={props.selectedRole}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="w-16 xs:w-40 sm:w-52">
						<SelectValue placeholder="Theme" />
					</SelectTrigger>
					<SelectContent>
						{
							props.roleRecords.map((record) => {
								return (
									<SelectItem
										value={record.role}
										key={record.role}
									>
										<div className="flex flex-row items-center gap-2">
											<UserRoleMark
												role={record.role}
												hasTooltip={false}
											/>
											<span className="capitalize">
												{t(`UserRole.${record.role}`)}{" - "}{record.latestFulfilledDate
													? t("General.past")
													: t("General.present")}
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
