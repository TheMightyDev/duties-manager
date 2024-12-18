import { SanityChecksDescription } from "@/app/user-dashboard/actions/sanity-checks/description";
import { StartSanityChecksButton } from "@/app/user-dashboard/actions/sanity-checks/start-sanity-checks-button";
import { api } from "@/trpc/server";

export default function SanityChecksPage() {
	async function* runChecks() {
		"use server";
		
		const asyncGenerator = await api.sanityCheck.runChecks();
		
		for await (const m of asyncGenerator) {
			yield m;
		}
	}

	return (
		<div dir="ltr">
			<SanityChecksDescription />
			<StartSanityChecksButton runChecks={runChecks}/>
		</div>
	);
}
