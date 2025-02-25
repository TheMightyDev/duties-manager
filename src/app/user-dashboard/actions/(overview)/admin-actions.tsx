"use client";

import { QuestionCircleSvgIcon } from "@/app/_components/svg-icons/ui/question-circle-svg-icon";
import { GoToActionButton } from "@/app/user-dashboard/actions/(overview)/go-to-action-button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function AdminActions() {
	const pathname = usePathname();
	const t = useTranslations();
	
	return (
		<>
			<h3 className="text-xl font-bold">
				{t("Actions.Admin.title")}
			</h3>
			<hr />
			<div className="flex flex-row flex-wrap gap-2 p-2">
				<GoToActionButton
					href={`${pathname}/upload/users`}
					prefetch={false}
					icon={
						<QuestionCircleSvgIcon
							className="size-14 fill-white/80"
						/>
					}
				>
					{t("Actions.Admin.upload-users")}
				</GoToActionButton>
				<GoToActionButton
					href={`${pathname}/upload/guarding-assignments`}
					prefetch={false}
					icon={
						<QuestionCircleSvgIcon
							className="size-14 fill-white/80"
						/>
					}
				>
					{t("Actions.Admin.upload-guarding-assignments")}
				</GoToActionButton>
				<GoToActionButton
					href={`${pathname}/sanity-check`}
					prefetch={false}
					icon={
						<QuestionCircleSvgIcon
							className="size-14 fill-white/80"
						/>
					}
				>
					{t("Actions.Admin.sanity-check")}
				</GoToActionButton>
				<GoToActionButton
					href={`${pathname}`}
					prefetch={false}
					additionalMark="soon"
					icon={
						<QuestionCircleSvgIcon
							className="size-14 fill-white/80"
						/>
					}
				>
					{t("Actions.Admin.create-users")}
				</GoToActionButton>
			</div>
		</>
	);
};
