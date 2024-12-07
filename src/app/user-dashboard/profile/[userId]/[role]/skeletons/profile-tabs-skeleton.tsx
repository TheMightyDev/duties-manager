import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { auth } from "@/server/auth";
import clsx from "clsx";

interface ProfileTabsSkeletonProps {
	userId: string;
}

export async function ProfileTabsSkeleton(props: ProfileTabsSkeletonProps) {
	const session = await auth();
	const isLoggedUserOrAdmin = session?.user.id === props.userId || session?.user.isAdmin;
	
	return (
		<>
			<Tabs
				defaultValue="assignments"
				className="max-w-[600px] grow  lg:mt-12"
			>
				<TabsList
					className={
						clsx(
							"grid w-full",
							isLoggedUserOrAdmin ? "grid-cols-2" : "grid-cols-1"
						)
					}
					dir="rtl"
				>
					{
						<TabsTrigger
							value="assignments"
							className="grow"
						>
							שיבוצים
						</TabsTrigger>
					}
					{
						isLoggedUserOrAdmin &&
						<TabsTrigger value="periods">
							תפקידים
						</TabsTrigger>
					}
				</TabsList>
				<TabsContent
					value="assignments"
					className="flex flex-col gap-2 px-2"
				>
					{
						new Array(3).fill(0).map((_, i) => (
							<div
								key={`box-${String(i)}`}
								className="h-16 w-full animate-pulse rounded-xl bg-slate-200"
							></div>
						))
					}
				</TabsContent>
			</Tabs>
		</>
	);
};

