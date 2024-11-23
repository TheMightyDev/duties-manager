import { SideNav } from "@/app/_components/side-nav/side-nav";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	
	if (!session) {
		redirect("/api/auth/signin");
	}
	
	return (
		<div className="flex w-full flex-col md:flex-row">
			<SideNav />
			<main className="flex-auto  pb-20 md:pb-0 ">
				{children}
			</main>
			<div className="pointer-events-none fixed bottom-16 block h-8 w-screen bg-gradient-to-t from-white md:hidden"></div>
			<div className="fixed bottom-0 me-4 block h-16 w-screen bg-slate-300 md:hidden">
				
			</div>
		</div>
	);
}
