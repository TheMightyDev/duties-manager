import { SideNav } from "@/app/_components/side-nav/side-nav";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex w-full flex-col md:flex-row">
			<SideNav />
			<main className="flex-auto pb-16 md:pb-0">
				{children}
			</main>
			<div className="fixed bottom-0 me-4 block h-16 w-screen bg-slate-300 md:hidden">
				
			</div>
		</div>
	);
}
