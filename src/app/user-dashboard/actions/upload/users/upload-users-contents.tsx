"use client";

import { type InitialParseResults, UploadProgress } from "@/app/user-dashboard/actions/upload/types";
import { type UsersUploadCounts } from "@/app/user-dashboard/actions/upload/users/types";
import { useRef, useState } from "react";

interface UploadUsersContentsProps {
	validateUsersInfo: (usersInfoUnformatted: string) => Promise<InitialParseResults>;
	uploadCachedValidParsedInfo: () => Promise<UsersUploadCounts>;
}

export function UploadUsersContents(props: UploadUsersContentsProps) {
	const usersInfoTextAreaRef = useRef<HTMLTextAreaElement>(null);
	const [ errorMessages, setErrorMessages ] = useState<string[]>([]);
	const [ parsedInfoJson, setParsedInfoJson ] = useState<string>("");
	const [ uploadProgress, setUploadProgress ] = useState<UploadProgress>(UploadProgress.NOTHING_SUBMITTED);
	const [ uploadCounts, setUploadCounts ] = useState<UsersUploadCounts | null>(null);
	
	function validateInfo() {
		const usersInfoStr = usersInfoTextAreaRef.current?.value ?? "";
		console.log("it's good");
		
		props.validateUsersInfo(usersInfoStr)
			.then((data) => {
				setErrorMessages(data.errorMessages);
				setParsedInfoJson(data.parsedInfoJson);
			
				setUploadProgress(
					data.errorMessages.length > 0
						? UploadProgress.ERRONEOUS_DATA
						: UploadProgress.CAN_BE_UPLOADED
				);
			})
			.catch((error) => {
				setErrorMessages([ (error as Error).message ]);
			});
	}
	
	function uploadData() {
		// The data, only if it passes the validations, is cached on the server
		// Only a JSON is sent from the server
		props.uploadCachedValidParsedInfo()
			.then(
				(counts) => {
					setUploadProgress(UploadProgress.UPLOAD_DONE);
					setUploadCounts(counts);
				}
			)
			.catch(
				(error) => {
					setErrorMessages([ ( error as Error).message ]);
				}
			);
	}
	
	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<td>דרגה</td>
						<td>שם פרטי</td>
						<td>שם משפחה</td>
						<td>מין (תו אחד)</td>
						<td>תפקיד</td>
						<td>תאריך תחילת תפקיד</td>
						<td>תאריך כניסה לקבע</td>
						<td>תאריך שחרור</td>
						<td>מספר טלפון</td>
					</tr>
				</thead>
			</table>
			<textarea
				ref={usersInfoTextAreaRef}
				className="w-full"
				style={{
					tabSize: 40,
				}}
			/>
			<button onClick={validateInfo}>
				אימות
			</button>
			{
				(uploadProgress === UploadProgress.ERRONEOUS_DATA) &&
				<p>There are errors with the uploaded data, fix them and then verify</p>
			}
			{
				(uploadProgress === UploadProgress.CAN_BE_UPLOADED) &&
				<>
					<p>There data is good - let's upload!</p>
					<button onClick={uploadData}>Upload</button>
				</>
			}
			{
				(uploadProgress === UploadProgress.UPLOAD_DONE) &&
				<>
					<p> Upload done! </p>
					{
						uploadCounts &&
						<ul>
							<li> Users: { uploadCounts.users } </li>
							<li> Periods: { uploadCounts.periods } </li>
						</ul>
					}
				</>
			}
			
			{
				(errorMessages.length > 0) &&
				<ul dir="ltr">
					{
						errorMessages.map((errorMessage) => (
							<li key={errorMessage}>
								{errorMessage}
							</li>
						))
					}
				</ul>
				
			}
			<pre dir="ltr">
				{ parsedInfoJson }
			</pre>
		</>
	);
};
