import { sortUserJusticesByWeightedScore } from "@/app/_utils/sort-user-justices";
import { PreferencesCalendar } from "@/app/user-dashboard/calendar/preferences-calendar";
import { api } from "@/trpc/server";
import { UserRole, type Preference } from "@prisma/client";
import { addDays } from "date-fns";
import { type NextPage } from "next";
import { seedUsers } from "prisma/seed-data/seed-users";

const UserDashboardPage: NextPage = async () => {
	const fetchPreferences = async ({ userId }: {
		userId: string;
	}) => {
		"use server";
		
		return await api.preference.getUserPreferencesById(userId);
	};
	
	const initialPreferences = await fetchPreferences({
		userId: "user1",
	});
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
	const updatePreference = async (updatedPreference: Partial<Preference> & {
		id: string;
	}) => {
		"use server";
		
		return await api.preference.update(updatedPreference);
	};
	
	const fetchJustice = async () => {
		"use server";
		
		const userJustices = await api.justice.getUsersJustice({
			roles: [ UserRole.SQUAD, UserRole.COMMANDER ],
			definitiveDate: addDays(new Date(), -20),
		});
		
		return sortUserJusticesByWeightedScore({
			userJustices,
			ascending: false,
		});
	};
	
	async function fetchExemptions() {
		"use server";
		
		return await api.preference.getUserExemptionsById(seedUsers[0].id);
	}
	
	async function fetchPossibleAssignees() {
		"use server";
		
		return await api.possibleAssignments.getPossibleAssignees({
			dutyStartDate: new Date(2024, 10, 7),
			dutyEndDate: new Date(2024, 10, 10),
			requiredRole: UserRole.SQUAD,
		});
	}
	
	return (
		<>
			<PreferencesCalendar
				initialPreferences={initialPreferences}
				fetchPreferences={fetchPreferences}
				createPreference={createPreference}
				deletePreference={deletePreference}
				updatePreference={updatePreference}
			/>
			<pre dir="ltr">
				{ JSON.stringify(await fetchPossibleAssignees(), null, 2) }
			</pre>
			<pre dir="ltr">
				{ JSON.stringify(await fetchJustice(), null, 2) }
			</pre>
		</>
	);
};

export default UserDashboardPage;
