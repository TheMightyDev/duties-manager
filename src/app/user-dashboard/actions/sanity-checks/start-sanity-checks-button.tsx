"use client";

import { Button } from "@/app/_components/ui/button";
import { useRef, useState } from "react";

function mimicLongOperation() {
	return new Promise<string>((resolve) => {
		setTimeout(() => {
			resolve("done");
		}, 20 * 1_000);
	});
}

interface StartSanityChecksButtonProps {
	runChecks: () => AsyncGenerator<number, void, unknown>;
}

export function StartSanityChecksButton({ runChecks }: StartSanityChecksButtonProps) {
	const countChecksTimeRef = useRef<NodeJS.Timeout | null>(null);
	const [ findings, setFindings ] = useState<string[]>([]);
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
		for await (let m of asyncGenerator) {
			setFindings((prev) => [
				String(m),
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
			<ul className="list-disc ps-5">
				{
					findings.map((finding) => (
						<li key={finding}>{finding}</li>
					))
				}
			</ul>
		</>
	);
};
