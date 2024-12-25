"use client";

import { QuestionCircleSvgIcon } from "@/app/_components/svg-icons/ui/question-circle-svg-icon";
import { GoToActionButton } from "@/app/user-dashboard/actions/(overview)/go-to-action-button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function UserActions() {
	const pathname = usePathname();
	const t = useTranslations();
	
	return (
		<>
			<h3 className="text-xl font-bold">
				{t("Actions.User.title")}
			</h3>
			<hr />
			<div className="flex flex-row flex-wrap gap-2 p-2">
				<GoToActionButton
					href={`${pathname}/common-questions`}
					prefetch={false}
					icon={
						<QuestionCircleSvgIcon
							className="size-14 fill-white/80"
						/>
					}
				>
					{t("Actions.User.q-and-a")}
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
					{t("Actions.User.submit-preferences")}
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
					{t("Actions.User.view-credits")}
				</GoToActionButton>
			</div>
		</>
	);
};
