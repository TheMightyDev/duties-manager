import { type SvgIconProps } from "@/app/_components/svg-icons/common-svg-icon-props";
import { CommanderSvgIcon } from "@/app/_components/svg-icons/user-roles/commander-svg-icon";
import { ExemptSvgIcon } from "@/app/_components/svg-icons/user-roles/exempt-svg-icon";
import { OfficerSvgIcon } from "@/app/_components/svg-icons/user-roles/officer-svg-repo";
import { SquadSvgIcon } from "@/app/_components/svg-icons/user-roles/squad-svg-icon";
import { UserRole } from "@prisma/client";

export const userRoleIcons: Record<UserRole, (params: SvgIconProps) => React.ReactNode> = {
	[UserRole.SQUAD]: SquadSvgIcon,
	[UserRole.OFFICER]: OfficerSvgIcon,
	[UserRole.COMMANDER]: CommanderSvgIcon,
	[UserRole.EXEMPT]: ExemptSvgIcon,
};
