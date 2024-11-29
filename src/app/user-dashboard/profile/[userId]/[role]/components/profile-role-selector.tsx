"use client";

import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { type ProfileRoleSelectorProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { type UserRole } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { usePathname, useRouter } from "next/navigation";

export function ProfileRoleSelector({ roleRecords, selectedRole }: ProfileRoleSelectorProps) {
	const router = useRouter();
	const pathname = usePathname();
	
	function switchRoleInPathname(role: UserRole | "LATEST"): string {
		const pathnameArray = pathname.split("/");
		const nextPathnameArray = pathnameArray.slice(0, pathnameArray.length - 1).concat(role);
		
		const nextPathname = nextPathnameArray.join("/");
		
		return nextPathname;
	}
	
	// useEffect(() => {
	// 	roleRecords.splice(0, roleRecords.length - 1).forEach((record) => {
	// 		console.log("prefetch", switchRoleInPathname(record.role));
	// 		router.prefetch(switchRoleInPathname(record.role));
	// 	});
		
	// 	router.prefetch(switchRoleInPathname("LATEST"));
	// }, []);
	
	function handleValueChange(nextRole: string) {
		router.push(switchRoleInPathname(nextRole as UserRole));
	}
	
	return (
		<>
			<DirectionProvider dir="rtl">
				<Select
					value={selectedRole}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Theme" />
					</SelectTrigger>
					<SelectContent>
						{
							roleRecords.map((record, i) => {
								const value = i === roleRecords.length - 1 ? "LATEST" : record.role;
							
								return (
									<SelectItem
										value={value}
										key={value}
									>
										<UserRoleMark
											role={record.role}
											hasTooltip={false}
										/>
										{record.role} - {record.latestFulfilledDate
											? "עבר"
											: "נוכחי"}
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
