import { DutiesCalendar } from "@/app/admin/duties/DutiesCalendar";
import { api } from "@/trpc/server";
import { type NextPage } from "next";

const AdminDutiesPage: NextPage = async () => {
	const fetchDutiesInMonth = async ({
		year,
		monthIndex,
	}: {
		year: number;
		monthIndex: number;
	}) => {
		"use server";
		
		return await api.duty.getAllInMonth({
			year,
			monthIndex,
		});
	};
	
	const initialDutiesWithAssignments = await fetchDutiesInMonth({
		monthIndex: new Date().getUTCMonth(),
		year: new Date().getUTCFullYear(),
	});
	
	return (
		<>
			<DutiesCalendar initialDutiesWithAssignments={initialDutiesWithAssignments}/>
			<pre dir="ltr">
				{ JSON.stringify(initialDutiesWithAssignments, null, 2) }
			</pre>
			
		</>
	);
};

export default AdminDutiesPage;
