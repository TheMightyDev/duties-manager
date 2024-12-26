import { initialDutiesSelectOptions } from "@/app/user-dashboard/duties/list-view/const";
import { DutiesListViewPageContents } from "@/app/user-dashboard/duties/list-view/duties-list-view-page-contents";
import { api } from "@/trpc/server";
import { type DutiesSelectOptions } from "@/types/duties/duties-select-options-schema";

export async function PageWrapper() {
	async function getDuties(options: DutiesSelectOptions) {
		"use server";
			
		return await api.duty.getManyDuties(options);
	}
		
	const initialDuties = await getDuties(initialDutiesSelectOptions);
	
	return (
		<DutiesListViewPageContents
			initialDuties={initialDuties}
			getDuties={getDuties}
		/>
	);
}
