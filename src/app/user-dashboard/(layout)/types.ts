import { type User } from "@prisma/client";
import type React from "react";

export interface RouteInfo {
	id: string;
	name: string;
	href: string;
	icon: React.ReactElement;
	selectedIcon: React.ReactElement;
}

export interface CheckIfOnRouteParams {
	routeInfos: RouteInfo[];
	pathname: string;
	routeId: string;
	loggedUserId: User["id"];
}

export interface LinkGroupProps {
	loggedUserId: User["id"];
	routeInfos: RouteInfo[];
}
