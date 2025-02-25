import { PreferencesCalendar } from "@/app/user-dashboard/calendar/preferences-calendar";
import { api } from "@/trpc/server";
import { UserRole, type Preference } from "@prisma/client";

export default async function UserDashboardPage() {
	const fetchPreferences = async ({ userId }: { userId: string }) => {
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
	const updatePreference = async (
		updatedPreference: Partial<Preference> & {
			id: string;
		},
	) => {
		"use server";

		return await api.preference.update(updatedPreference);
	};

	async function fetchPossibleAssignees() {
		"use server";

		const possibleAssignees =
			await api.possibleAssignments.getPossibleAssignees({
				dutyStartDate: new Date(2024, 10, 7),
				dutyEndDate: new Date(2024, 10, 10),
				requiredRole: UserRole.SQUAD,
			});

		const possibleAssigneesJustice = await api.justice.getUsersJustice({
			definitiveDate: new Date(),
			userIds: possibleAssignees.map((possibility) => possibility.id),
		});

		return possibleAssigneesJustice;
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
				{JSON.stringify(await fetchPossibleAssignees(), null, 2)}
			</pre>
		</>
	);
}
