import { api } from "@/trpc/server";

interface PeriodsContainerProps {
	userId: string;
}

export async function PeriodsContainer({ userId }: PeriodsContainerProps) {
	const periods = await api.user.getUserPeriodsById(userId);
	
	return (
		<pre dir="ltr">
			{
				JSON.stringify(periods, null, 2)
			}
		</pre>
	);
};
