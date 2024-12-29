import { userRoleIcons } from "@/app/_components/svg-icons/user-roles/user-role-icons";
import { cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";

const userRoleBgs: Record<UserRole, string> = {
	[UserRole.SQUAD]: "bg-role-squad",
	[UserRole.OFFICER]: "bg-role-officer",
	[UserRole.COMMANDER]: "bg-role-commander",
	[UserRole.EXEMPT]: "bg-role-exempt",
};

interface UserRoleMarkProps {
	role: UserRole;
	hasTooltip?: boolean;
	className?: string;
	// size?: "sm" | "md" | "lg";
}

export function UserRoleMark({
	role,
	hasTooltip = true,
	className,
	// size = "md",
}: UserRoleMarkProps) {
	const iconObj = {
		icon: userRoleIcons[role],
	};
	
	return (
		<div className="group/role-mark relative inline-block">
			<div className={cn(
				`m-auto flex size-7 items-center justify-center text-white ${userRoleBgs[role]}
				rounded-xl`,
				className
			)}
			>
				<iconObj.icon className={"size-3/4"} />
			</div>
			{
				hasTooltip &&
				<div
					role="tooltip"
					className="absolute left-1/2 top-full z-10 mt-2 hidden w-max -translate-x-1/2 rounded bg-slate-500 px-2 py-1 text-xs text-white group-hover/role-mark:block"
				>
					{role}
					<div className="absolute bottom-full left-1/2 size-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-slate-500"></div>
				</div>
			}
		</div>
	);
};
