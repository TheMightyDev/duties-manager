"use client";

import { useRef } from "react";

interface UploadContentsProps {
	validateUsersInfo: (usersInfoUnformatted: string) => void;
}

export function UploadContents(props: UploadContentsProps) {
	const usersInfoTextAreaRef = useRef<HTMLTextAreaElement>(null);
	
	function validateInfo() {
		const usersInfoUnformatted = usersInfoTextAreaRef.current?.value ?? "";
		console.log("it's good");
		
		props.validateUsersInfo(usersInfoUnformatted);
	}
	
	return (
		<>
			<textarea ref={usersInfoTextAreaRef} />
			<button onClick={validateInfo}>
				אימות
			</button>
		</>
	);
};
