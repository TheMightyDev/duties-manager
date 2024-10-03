import NavLinks from "@/app/_components/side-nav/nav-links";
import Link from "next/link";

export default function SideNav() {
	return (
		<div className="flex-col ps-2 pe-5 py-4 hidden md:flex [height:100vh]">
			<Link
				className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
				href="/">
				<div className="w-32 text-white md:w-40">
					XXX
				</div>
			</Link>
			<div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
				<NavLinks />
				<div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
				<form>
					<button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
						<div>I</div>
						<div className="hidden md:block">
							התנתקות
						</div>
					</button>
				</form>
			</div>
		</div>
	);
}
