import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function RedirectToLoggedUserProfilePage() {
	const session = await auth();
	
	const loggedUserId = session?.user.id;
	
	if (loggedUserId) {
		redirect(`/user-dashboard/profile/${loggedUserId}/LATEST`);
	} else {
		redirect("/");
	}
	
	return (
		<></>
	);
}
