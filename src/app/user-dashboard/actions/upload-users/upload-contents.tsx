"use client";

import { type ParseUsersInfoStrReturn, type UploadCounts } from "@/app/user-dashboard/actions/types";
import { useRef, useState } from "react";

interface UploadContentsProps {
	validateUsersInfo: (usersInfoUnformatted: string) => Promise<ParseUsersInfoStrReturn>;
	uploadCachedValidParsedInfo: () => Promise<UploadCounts>;
}

enum UploadProgress {
	NOTHING_SUBMITTED,
	ERRONEOUS_DATA,
	CAN_BE_UPLOADED,
	UPLOAD_DONE,
}

export function UploadContents(props: UploadContentsProps) {
	const usersInfoTextAreaRef = useRef<HTMLTextAreaElement>(null);
	const [ errorMessages, setErrorMessages ] = useState<string[]>([]);
	const [ parsedInfoJson, setParsedInfoJson ] = useState<string>("");
	const [ uploadProgress, setUploadProgress ] = useState<UploadProgress>(UploadProgress.NOTHING_SUBMITTED);
	const [ uploadCounts, setUploadCounts ] = useState<UploadCounts | null>(null);
	
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
			<textarea
				ref={usersInfoTextAreaRef}
				className="w-full"
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
