import { UploadContents } from "@/app/user-dashboard/upload/upload-contents";

export default async function UploadPage() {
	async function validateUsersInfo(usersInfoUnformatted: string) {
		"use server";
		
		const users = usersInfoUnformatted
			.split(/\r?\n/g)
			.map((str) => {
				const [
					fullName,
					role,
					gender,
				] = str.split("\t");
				
				return {
					fullName,
					role,
					gender,
				};
			});
			
		console.log(users);
	}
	
	return (
		<>
			<UploadContents validateUsersInfo={validateUsersInfo}/>
		</>
	);
};
