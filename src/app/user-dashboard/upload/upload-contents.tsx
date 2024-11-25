"use client";

import { type ParseUsersInfoStrReturn } from "@/app/user-dashboard/upload/types";
import { useRef, useState } from "react";

interface UploadContentsProps {
	validateUsersInfo: (usersInfoUnformatted: string) => Promise<ParseUsersInfoStrReturn>;
	uploadCachedValidParsedInfo: () => Promise<string>;
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
	
	function validateInfo() {
		const usersInfoStr = usersInfoTextAreaRef.current?.value ?? "";
		console.log("it's good");
		
		props.validateUsersInfo(usersInfoStr).then((data) => {
			setErrorMessages(data.errorMessages);
			setParsedInfoJson(data.parsedInfoJson);
			
			setUploadProgress(
				data.errorMessages.length > 0
					? UploadProgress.ERRONEOUS_DATA
					: UploadProgress.CAN_BE_UPLOADED
			);
		});
	}
	
	function uploadData() {
		// The data, only if it passes the validations, is cached on the server
		// Only a JSON is sent from the server
		props.uploadCachedValidParsedInfo();
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
