
import { EventsCalendar } from "@/app/user-dashboard/EventsCalendar";
import { api } from "@/trpc/server";
import { type Preference } from "@prisma/client";
import { type NextPage } from "next";
import { seedUsers } from "prisma/seedData/seedUsers";

const UserDashboardPage: NextPage = async () => {
	const preferences = await api.preference.getUserPreferencesInMonth({
		userId: seedUsers[0].id,
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});
	
	console.log("@preferences", preferences);
	
	const addNewPreference = async (newPreference: Preference) => {
		"use server";

		return await api.preference.addNew(newPreference);
	};
	
	return (
		<>
			<EventsCalendar
				initialPreferences={preferences}
				addNewPreference={addNewPreference}/>
		</>
	);
};

export default UserDashboardPage;
