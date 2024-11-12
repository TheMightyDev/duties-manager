"use client";

import { type ProfileRoleSelectorProps } from "@/app/user-dashboard/profile/[userId]/[role]/types";
import { type UserRole } from "@prisma/client";
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
	
	function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const nextRole = event.target.value as UserRole;
		
		router.push(switchRoleInPathname(nextRole));
	}
	
	return (
		<select
			value={selectedRole}
			onChange={handleChange}
		>
			{
				roleRecords.map((record, i) => {
					const value = i === roleRecords.length - 1 ? "LATEST" : record.role;
					
					return (
						<option
							value={value}
							key={value}
						>
							{record.role} - {record.latestFulfilledDate
								? "עבר"
								: "נוכחי"}
						</option>
					);
				})
			}
		</select>
	);
};
