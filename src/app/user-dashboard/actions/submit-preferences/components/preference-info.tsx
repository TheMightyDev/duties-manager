import { type Preference } from "@prisma/client";
import { useTranslations } from "next-intl";

interface PreferenceInfoProps {
	preference: Preference;
}

export function PreferenceInfo(props: PreferenceInfoProps) {
	const t = useTranslations();
	const { preference } = props;

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-lg font-semibold">{preference.description}</h3>
			<p>{preference.kind}</p>
			<p>{t(`PreferenceImportance.${preference.importance}`)}</p>
		</div>
	);
}
