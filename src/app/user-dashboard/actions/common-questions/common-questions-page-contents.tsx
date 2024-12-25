"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/_components/ui/accordion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";

const questionGroups = {
	scoringSystem: [
		"scoringSystemInDepth",
		"scoringPerDuty",
	],
	months: [
		"monthsInRoleCalculation",
	],
} as const;

export function CommonQuestionsPageContents() {
	const searchParams = useSearchParams();
	const containerRef = useRef<HTMLDivElement>(null);
	const t = useTranslations();
	
	const defaultOpenQuestionId = searchParams.get("qId");
	
	useEffect(() => {
		if (!containerRef.current) return;
		
		const openQuestionElement = containerRef.current.querySelector(`[data-question-id=${defaultOpenQuestionId}]`);
		
		if (!openQuestionElement) return;
		
		openQuestionElement.scrollIntoView();
		
		const className = "bg-blue-200";
		openQuestionElement.classList.add(className);
		
		setTimeout(() => {
			openQuestionElement.classList.remove(className);
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
				Object.entries(questionGroups).map(
					([ groupId, questionIds ]) => (
						<Fragment key={groupId}>
							<h3 className="font-bold">
								{t(`CommonQuestions.groupTitles.${groupId as keyof typeof questionGroups}`)}
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
