import type React from "react";

export interface RouteInfo {
	id: string;
	name: string;
	href: string;
	icon: React.ReactElement;
	selectedIcon: React.ReactElement;
}
