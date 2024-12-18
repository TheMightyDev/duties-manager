"use client";

import { ExternalLinkSvgIcon } from "@/app/_components/svg-icons/ui/external-link-svg-icon";
import { Button } from "@/app/_components/ui/button";
import { type SanityCheckError } from "@/types/sanity-check/sanity-check-error";
import Link from "next/link";
import { useRef, useState } from "react";

interface SanityChecksRunnerProps {
	runChecks: () => AsyncGenerator<string, void, unknown>;
}

export function SanityChecksRunner({ runChecks }: SanityChecksRunnerProps) {
	const countChecksTimeRef = useRef<NodeJS.Timeout | null>(null);
	const [ errors, setErrors ] = useState<SanityCheckError[]>([]);
	const [ secondsPassed, setSecondsPassed ] = useState(0);
	
	function startCountUp() {
		setSecondsPassed(0);
		
		countChecksTimeRef.current = setInterval(() => {
			setSecondsPassed((prev) => prev + 1);
		}, 1000);
	}
	
	function stopCountUp() {
		if (countChecksTimeRef.current) {
			clearTimeout(countChecksTimeRef.current);
		}
	}
	
	async function startSanityChecks() {
		startCountUp();
		const asyncGenerator = await runChecks();
		for await (let errorJson of asyncGenerator) {
			const parsedError = JSON.parse(errorJson) as SanityCheckError;
			
			setErrors((prev) => [
				parsedError,
				...prev,
			]);
		}
		
		stopCountUp();
	}
	
	const areSanityChecksRunning = secondsPassed > 0;
	
	return (
		<>
			{
				!areSanityChecksRunning &&
				<Button onClick={startSanityChecks}> Start sanity checks </Button>
			}
			{
				areSanityChecksRunning &&
				<p>{secondsPassed} seconds passed</p>
			}
			<table>
				<thead>
					<tr>
						<th>User ID</th>
						<th>User full name</th>
						<th>Kind</th>
						<th>Message</th>
						<th>Link to profile</th>
					</tr>
				</thead>
				<tbody>
					{
						errors.map((error) => (
							<tr key={`${error.userId}-${error.message}`}>
								<td className="font-mono">{error.userId}</td>
								<td>{error.userFullName}</td>
								<td>{error.kind}</td>
								<td>{error.message}</td>
								<td><Link href={`/user-dashboard/profile/${error.userId}/LATEST`}><ExternalLinkSvgIcon className="size-5 stroke-black"/></Link></td>
							</tr>
						))
					}
				</tbody>
				
			</table>
		</>
	);
};
