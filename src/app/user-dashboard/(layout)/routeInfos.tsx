import { CalendarFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/calendar-filled-svg-icon";
import { CalendarSvgIcon } from "@/app/_components/svg-icons/navigaton/calendar-svg-icon";
import { JusticeFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/justice-filled-svg-icon";
import { JusticeSvgIcon } from "@/app/_components/svg-icons/navigaton/justice-svg-icon";
import { MagicWandSvgIcon } from "@/app/_components/svg-icons/navigaton/magic-wand-svg-icon";
import { ProfileCircleFilledSvgIcon } from "@/app/_components/svg-icons/navigaton/profile-circle-filled-svg-icon";
import { ProfileCircleSvgIcon } from "@/app/_components/svg-icons/navigaton/profile-circle-svg-icon";
import { type RouteInfo } from "@/app/user-dashboard/(layout)/types";

export const routeInfos: RouteInfo[] = [
	{
		id: "calendar",
		name: "לוח שנה",
		href: "/user-dashboard/calendar",
		icon: <CalendarSvgIcon className="m-auto size-9 stroke-black"/>,
		selectedIcon: <CalendarFilledSvgIcon className="m-auto size-9 stroke-black"/>,
	},
	{
		id: "justice",
		name: "טבלת הצדק",
		href: "/user-dashboard/justice",
		icon: <JusticeSvgIcon className="m-auto size-9 fill-black p-0.5" />,
		selectedIcon: <JusticeFilledSvgIcon className="m-auto size-9 fill-white/80 p-0.5" />,
	},
	{
		id: "my-profile",
		name: "הפרופיל שלי",
		// This page is simply a redirect to the user's own profile
		href: "/user-dashboard/profile",
		icon: <ProfileCircleSvgIcon className="m-auto size-9 stroke-black"/>,
		selectedIcon: <ProfileCircleFilledSvgIcon className="m-auto size-9 fill-white/80"/>,
	},
	{
		id: "actions",
		name: "פעולות",
		href: "/user-dashboard/actions",
		icon: <MagicWandSvgIcon className="m-auto size-9 stroke-black"/>,
		selectedIcon: <MagicWandSvgIcon className="m-auto size-9 stroke-white/80"/>,
	},
] as const;

