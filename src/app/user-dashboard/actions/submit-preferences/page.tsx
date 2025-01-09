import { PersonalCalendar } from "@/app/user-dashboard/actions/submit-preferences/personal-calendar";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Preference } from "@prisma/client";
import "react-toastify/dist/ReactToastify.css";

export default async function SubmitPreferencesPage() {
	const session = await auth();
	
	if (!session?.user) return <></>;
	
	const fetchPreferences = async ({ userId }: {
		userId: string;
	}) => {
		"use server";
			
		return await api.preference.getUserPreferencesById(userId);
	};
		
	const initialPreferences = await fetchPreferences({
		userId: session?.user.id,
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
	
	return (
		<div dir="ltr">
			<PersonalCalendar
				initialPreferences={initialPreferences}
				fetchPreferences={fetchPreferences}
				createPreference={createPreference}
				deletePreference={deletePreference}
				updatePreference={updatePreference}
			/>
		</div>
	);
}
