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
	
	const initialDuties = await fetchDutiesInMonth({
		monthIndex: new Date().getUTCMonth(),
		year: new Date().getUTCFullYear(),
	});
	
	return (
		<>
			<pre dir="ltr">
				{ JSON.stringify(initialDuties, null, 2) }
			</pre>
		</>
	);
};

export default AdminDutiesPage;
