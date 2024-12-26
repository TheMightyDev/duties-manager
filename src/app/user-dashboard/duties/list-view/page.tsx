import { PageWrapper } from "@/app/user-dashboard/duties/list-view/page-wrapper";
import { Suspense } from "react";

export default async function DutiesListViewPage() {
	return (
		<Suspense fallback="waiting...">
			<PageWrapper />
		</Suspense>
	);
}
