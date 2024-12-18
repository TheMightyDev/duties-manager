export function SanityChecksDescription() {
	return (
		<div className="[&_ul]:list-disc [&_ul]:ps-6">
			<p>
				The execution performs several checks:
			</p>
			<ul>
				<li className="list-disc">
					Finds cases where a user was assigned (reserve or actual assignment) to a duty while in mismatch period:
					<ul>
						<li>Before joining the unit</li>
						<li>After retire date</li>
						<li>The duty requires one role, but the user in a different role at the same time</li>
						<li>The duty is guarding, but the user is temporarily exempt/absent at the time</li>
					</ul>
				</li>
				<li>
					Finds users with invalid periods:
					<ul>
						<li>Unless it's the first period, the start date of a period must be the end date of the previous period (for continuation)</li>
						<li>Periods must not overlap to each other. E.g.: a period starts in 2024-10-05 and ends on 2024-12-05. There cannot be a period that starts in any date between 2024-10-05 and 2024-12-05</li>
					</ul>
				</li>
			</ul>
			<p>
				It's worth running the checks from time to time. Note that it can take some time.
			</p>
		</div>
	);
}
