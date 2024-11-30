import { routeInfos } from "@/app/user-dashboard/(layout)/routeInfos";
import { type CheckIfOnRouteParams } from "@/app/user-dashboard/(layout)/types";

export function checkIfOnRoute({
	pathname,
	routeId,
	loggedUserId,
}: CheckIfOnRouteParams) {
	if (routeId === "my-profile") {
		return pathname.startsWith(`/user-dashboard/profile/${loggedUserId}`);
	} else if (routeId === "actions") {
		return pathname.startsWith("/user-dashboard/actions");
	} {
		const linkHref = routeInfos.find((link) => link.id === routeId);

		return linkHref?.href === pathname;
	}
}
