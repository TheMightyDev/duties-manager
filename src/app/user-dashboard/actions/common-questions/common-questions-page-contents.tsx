"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/_components/ui/accordion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";

export function CommonQuestionsPageContents() {
	const searchParams = useSearchParams();
	const containerRef = useRef<HTMLDivElement>(null);
	const t = useTranslations();
	
	const defaultOpenQuestionId = searchParams.get("qId");
	const groups = {
		scoringSystem: [
			"scoringSystemInDepth",
			"scoringPerDuty",
		],
		months: [
			"monthsInRoleCalculation",
			"monthsInRoleCalculation1",
			"monthsInRoleCalculation2",
			"monthsInRoleCalculation3",
			"monthsInRoleCalculation4",
			"monthsInRoleCalculation5",
			"monthsInRoleCalculation6",
			"monthsInRoleCalculation7",
			"monthsInRoleCalculation8",
		],
	} as const;
	
	useEffect(() => {
		if (!containerRef.current) return;
		
		const openQuestionElement = containerRef.current.querySelector(`[data-question-id=${defaultOpenQuestionId}]`);
		
		if (!openQuestionElement) return;
		
		openQuestionElement.scrollIntoView();
		
		openQuestionElement.classList.add("bg-green-500");
		
		setTimeout(() => {
			openQuestionElement.classList.remove("bg-green-500");
		}, 5000);
	}, [ defaultOpenQuestionId ]);
	
	return (
		<div
			className="max-w-[600px] pb-[100px]"
			ref={containerRef}
		>
			<h1 className="text-xl font-bold">
				{t("CommonQuestions.title")}
			</h1>
			{
				Object.entries(groups).map(
					([ groupId, questionIds ]) => (
						<Fragment key={groupId}>
							<h3 className="font-bold">
								{t(`CommonQuestions.groupTitles.${groupId as keyof typeof groups}`)}
							</h3>
							<Accordion
								type="multiple"
								defaultValue={defaultOpenQuestionId ? [ defaultOpenQuestionId ] : undefined}
							>
								{
									questionIds.map((questionId) => (
										<AccordionItem
											value={questionId}
											key={questionId}
											data-question-id={questionId}
										>
											<AccordionTrigger className="font-semibold">
												{t(`CommonQuestions.${questionId}.question`)}
											</AccordionTrigger>
											<AccordionContent>
												{t(`CommonQuestions.${questionId}.answer`)}
											</AccordionContent>
										</AccordionItem>
									))
								}
							</Accordion>
						</Fragment>
					)
				)
			}
			
			{searchParams.get("qId")}
		</div>
	);
};
