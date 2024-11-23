import { NavLinks } from "@/app/_components/side-nav/nav-links";
import { auth } from "@/server/auth";
import Link from "next/link";

export async function SideNav() {
	const session = await auth();
	
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
				<NavLinks />
				<div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
				<form>
					<Link
						href="/api/auth/signout"
						className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
					>
						<div>I</div>
						<div className="hidden md:block">
							התנתקות ({session?.user.id})
						</div>
					</Link>
				</form>
			</div>
		</div>
	);
}
