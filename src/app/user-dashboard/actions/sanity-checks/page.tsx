import { SanityChecksDescription } from "@/app/user-dashboard/actions/sanity-checks/description";
import { SanityChecksRunner } from "@/app/user-dashboard/actions/sanity-checks/sanity-checks-runner";
import { api } from "@/trpc/server";

export default function SanityChecksPage() {
	async function* runChecks() {
		"use server";
		
		const asyncGenerator = await api.sanityCheck.runChecksAndGenerateErrors();
		
		for await (const m of asyncGenerator) {
			yield m;
		}
	}

	return (
		<div dir="ltr">
			<SanityChecksDescription />
			<SanityChecksRunner runChecks={runChecks}/>
		</div>
	);
}
