"use client";

import { cn } from "@/app/_utils/cn";
import React, { useState } from "react";

export interface TabData {
	title: string;
	contents: React.ReactNode;
	isVisible?: boolean;
}

interface TabsProps {
	className: string;
	tabs: TabData[];
}

function areAllTabTitles(tabs: TabData[]): boolean {
	const titles = tabs.map((tab) => tab.title);
	
	return ((new Set(titles)).size === titles.length);
}

/** A general component which manages viewing of one tab at a time.
 * Handles switching between tabs and showing current tab contents on its own.
 */
export function Tabs({
	tabs,
	className,
}: TabsProps) {
	const [ selectedTabIndex, setSelectedTabIndex ] = useState(0);
	
	if (tabs.length == 0) {
		return "You must provide at least one tab to use the component!";
	}
	
	if (!areAllTabTitles(tabs)) {
		return "All tab IDs must be unique";
	}

	return (
		<>
			<div className="flex h-8 w-full text-center leading-8">
				{
					tabs.map((tab, tabIndex) => (
						(tab.isVisible ?? true) && (
							<div
								key={tab.title}
								className={cn(
									"rounded-full flex-1",
									tabIndex === selectedTabIndex ? "bg-blue-500 text-white font-bold" : "cursor-pointer hover:bg-slate-300"
								)}
								onClick={() => {
									setSelectedTabIndex(tabIndex);
								}}
							>
								{tab.title}
							</div>
						)))
				}
			</div>
			<div className={className}>
				{ tabs[selectedTabIndex]?.contents }
			</div>
		</>
	);
};
