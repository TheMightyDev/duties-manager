import { NavLinks } from "@/app/user-dashboard/(layout)/nav-links";
import { type LinkGroupProps } from "@/app/user-dashboard/(layout)/types";
import { auth } from "@/server/auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type SideNavProps = LinkGroupProps;

export async function SideNav(props: SideNavProps) {
	const session = await auth();
	const t = await getTranslations("NavigationTabs");
	
	return (
		<div className="sticky top-0 hidden flex-col py-4 pe-5 ps-2 [height:100vh] md:flex">
			<Link
				className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
				href="/"
			>
				<div className="w-32 text-white md:w-40">
					XXX
				</div>
			</Link>
			<div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
				<NavLinks {...props} />
				<div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
				<form>
					<Link
						href="/api/auth/signout"
						className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
					>
						<div className="hidden capitalize md:block">
							{t("logout")}({session?.user.fullName})
						</div>
					</Link>
				</form>
			</div>
		</div>
	);
}
