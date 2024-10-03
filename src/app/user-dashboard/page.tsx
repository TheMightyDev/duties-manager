
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
	
	const createPreference = async (newPreference: Preference) => {
		"use server";

		return await api.preference.create(newPreference);
	};
	
	const deletePreference = async (params: { id: string }) => {
		"use server";
		
		return await api.preference.delete(params);
	};
	
	/** The argument must be an existing preference. the preference
	 * with the same ID in the DB will be overrode.
	 */
	const updatePreference = async (updatedPreference: Preference) => {
		"use server";
		
		return await api.preference.update(updatedPreference);
	};
	
	return (
		<>
			<EventsCalendar
				initialPreferences={preferences}
				createPreference={createPreference}
				deletePreference={deletePreference}
				updatePreference={updatePreference} />
		</>
	);
};

export default UserDashboardPage;
