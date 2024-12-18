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
	
}

export function StartSanityChecksButton({}: StartSanityChecksButtonProps) {
	const countChecksTimeRef = useRef<NodeJS.Timeout | null>(null);
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
	
	function startSanityChecks() {
		startCountUp();
		
		mimicLongOperation().then(() => {
			stopCountUp();
		});
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
		</>
	);
};
