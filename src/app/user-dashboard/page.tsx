import { EventsCalendar } from "@/app/user-dashboard/EventsCalendar";
import { api } from "@/trpc/server";
import { type NextPage } from "next";
import { seedUsers } from "prisma/seedData/seedUsers";

const UserDashboardPage: NextPage = async () => {
	const preferences = await api.preference.getUserPreferencesInMonth({
		userId: seedUsers[0].id,
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});
	
	return (
		<>
			<EventsCalendar initialPreferences={preferences}/>
		</>
	);
};

export default UserDashboardPage;
