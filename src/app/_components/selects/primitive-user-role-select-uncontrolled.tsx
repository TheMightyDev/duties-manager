"use client";

import { UserRoleMark } from "@/app/_components/svg-icons/user-roles/user-role-mark";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/app/_components/ui/select";
import { type UserRole } from "@prisma/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import React from "react";

interface PrimitiveUserRoleSelectProps {
	availableRoles: UserRole[];
	defaultSelectedRole: UserRole;
	inputRef: React. (nextRole: UserRole) => void;
}

export function PrimitiveUserRoleSelectUncontrolled(props: PrimitiveUserRoleSelectProps) {
	function handleValueChange(nextRole: string) {
		props.inputRef(nextRole as UserRole);
	}
	
	return (
		<>
			<DirectionProvider dir="rtl">
				<Select
					value={props.defaultSelectedRole}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="w-20">
						<UserRoleMark role={props.defaultSelectedRole} />
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
											<span>
												{role}
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
