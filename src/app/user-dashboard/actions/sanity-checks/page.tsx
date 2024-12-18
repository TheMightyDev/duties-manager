import { SanityChecksDescription } from "@/app/user-dashboard/actions/sanity-checks/description";
import { StartSanityChecksButton } from "@/app/user-dashboard/actions/sanity-checks/start-sanity-checks-button";

export default function SanityChecksPage() {
	return (
		<div dir="ltr">
			<SanityChecksDescription />
			<StartSanityChecksButton />
		</div>
	);
}
