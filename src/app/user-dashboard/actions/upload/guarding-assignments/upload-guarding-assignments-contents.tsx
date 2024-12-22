"use client";

import { PrimitiveUserRoleSelect } from "@/app/_components/selects/primitive-user-role-select";
import { type AssignmentsUploadCounts, type ValidateUploadedInfoParams } from "@/app/user-dashboard/actions/upload/guarding-assignments/types";
import { UploadProgress, type InitialParseResults } from "@/app/user-dashboard/actions/upload/types";
import { UserRole } from "@prisma/client";
import { useRef, useState } from "react";

interface UploadGuardingContentsProps {
	validateUploadedInfo: (params: ValidateUploadedInfoParams) => Promise<InitialParseResults>;
	uploadCachedValidParsedInfo: () => Promise<AssignmentsUploadCounts>;
}

export function UploadGuardingAssignmentsContents(props: UploadGuardingContentsProps) {
	const infoTextAreaRef = useRef<HTMLTextAreaElement>(null);
	const [ errorMessages, setErrorMessages ] = useState<string[]>([]);
	const [ parsedInfoJson, setParsedInfoJson ] = useState<string>("");
	const [ uploadProgress, setUploadProgress ] = useState<UploadProgress>(UploadProgress.NOTHING_SUBMITTED);
	const [ uploadCounts, setUploadCounts ] = useState<AssignmentsUploadCounts | null>(null);
	const [ selectedUserRole, setSelectedUserRole ] = useState<UserRole>(UserRole.SQUAD);
	
	function validateInfo() {
		if (!infoTextAreaRef.current) return;
		
		const usersInfoStr = infoTextAreaRef.current.value;
		
		props.validateUploadedInfo({
			infoStr: usersInfoStr,
			userRole: selectedUserRole,
		})
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
			<div className="flex w-full flex-row justify-between">
				<div>
					תאריך התחלה
				</div>
				<div>
					משך בימים
				</div>
				<div>
					שם מלא משובץ
				</div>
				<div>
					?שם מלא רזרבה\ניקוד נוסף\הערה
				</div>
				<div>
					?ניקוד נוסף\הערה
				</div>
				<div>
					הערה?
				</div>
			</div>
			<textarea
				ref={infoTextAreaRef}
				className="w-full"
				style={{
					tabSize: 40,
				}}
			/>
			
			{
				uploadProgress === UploadProgress.NOTHING_SUBMITTED &&
				<PrimitiveUserRoleSelect
					availableRoles={Object.values(UserRole).filter((role) => role !== UserRole.EXEMPT)}
					selectedRole={selectedUserRole}
					handleRoleChange={(nextRole) => {
						setSelectedUserRole(nextRole);
					}}
				/>
			}
			
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
							<li> Duties: { uploadCounts.duties } </li>
							<li> Assignments: { uploadCounts.assignments } </li>
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
