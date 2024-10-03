import SideNav from "@/app/_components/side-nav/side-nav";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col w-full md:flex-row">
			{/* <div className="w-64 [height:100vh] me-4 md:block hidden"> */}
			<SideNav />
			{/* </div> */}
			<main className="flex-auto">
				{children}
			</main>
			<div className="[width:100vw] bg-slate-300 me-4 md:hidden block fixed bottom-0 h-16">
				
			</div>
		</div>
	);
}
