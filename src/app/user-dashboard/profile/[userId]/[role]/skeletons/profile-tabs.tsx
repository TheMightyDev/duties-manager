import { Tabs } from "@/app/_components/tabs-and-accordions/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/_components/ui/accordion";
import { DutyAssignments } from "@/app/user-dashboard/profile/[userId]/[role]/components/duty-assignments";
import { PeriodsContainer } from "@/app/user-dashboard/profile/[userId]/[role]/profile-data-components/periods-container";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type UserRole } from "@prisma/client";

interface ProfileTabsProps {
	userId: string;
	role: UserRole | "LATEST";
}

export async function ProfileTabs({ userId, role }: ProfileTabsProps) {
	const session = await auth();
	const isLoggedUserOrAdmin = session?.user.id === userId || session?.user.isAdmin;
	
	const [ assignments, periods ] = await (
		isLoggedUserOrAdmin
			? Promise.all([
				api.user.getUserAssignments({
					userId,
					role: role !== "LATEST" ? role : undefined,
				}),
				api.user.getUserPeriodsById(userId),
			])
			: Promise.all([
				api.user.getUserAssignments({
					userId,
					role: role !== "LATEST" ? role : undefined,
				}),
				null,
			])
	) ;
	
	return (
		<>
			<div className="block w-full p-2 md:hidden">
				<Accordion
					type="single"
					collapsible
					className="w-full"
				>
					{
						assignments &&
						<AccordionItem value="duty-assignments">
							<AccordionTrigger>תורנויות</AccordionTrigger>
							<AccordionContent>
								<DutyAssignments assignments={assignments} />
							</AccordionContent>
						</AccordionItem>
					}
					
					{
						periods &&
						<AccordionItem value="periods">
							<AccordionTrigger>תפקידים</AccordionTrigger>
							<AccordionContent>
								<PeriodsContainer periods={periods} />
							</AccordionContent>
						</AccordionItem>
					}
				</Accordion>
			</div>
			<div className="mt-12 hidden max-h-[70vh] w-full md:block">
				<Tabs
					className="h-full overflow-y-scroll"
					tabs={[
						{
							title: "תורנויות",
							contents: <>
								<DutyAssignments assignments={assignments!} />
							</>,
						},
						{
							title: "תפקידים",
							isVisible: isLoggedUserOrAdmin,
							contents: periods && <PeriodsContainer periods={periods} />,
						},
					]}
				/>
			</div>
		</>
	);
};

