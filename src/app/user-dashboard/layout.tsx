import { BottomNavigation } from "@/app/user-dashboard/(layout)/bottom-navigation";
import { SideNav } from "@/app/user-dashboard/(layout)/side-nav";
import { type LinkGroupProps } from "@/app/user-dashboard/(layout)/types";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	
	if (!session) {
		redirect("/api/auth/signin");
	}
	
	const loggedUserId = session.user.id;
	
	const linkGroupProps: LinkGroupProps = {
		loggedUserId,
	};
	
	return (
		<div
			className="flex w-full flex-col md:flex-row"
		>
			<SideNav {...linkGroupProps} />
			<main className="max-h-[90vh] flex-auto overflow-y-auto pb-20 md:pb-0">
				{children}
			</main>
			<div className="fixed bottom-0">
				<div className="pointer-events-none  block h-8 w-screen bg-gradient-to-t from-white md:hidden"></div>
				<BottomNavigation {...linkGroupProps}	/>
			</div>
		</div>
	);
}

