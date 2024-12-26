# Duties Manager

## Notes

### Prisma Zod Schemas generator

We use CUID2, but Prisma doesn't support it yet as a default for IDs (Zod does) - so the Zod Schemas generator validates the schemas against CUID1 instead of CUID2 - so after every DB migration, make sure to go `/orisma/generated/zod/index.ts` replace all `cuid()` with `cuid2()`

<https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=off&mod=on&nx=off&year=now&ss=off&mf=on&c=off&M=off&s=off&leyning=off>

## How are the Jewish holidays obtained?

First we obtain them from the Hebcal REST API (which needs to be credited)
<https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=off&mod=on&nx=off&start=2023-01-01&end=2026-01-01&ss=off&mf=on&c=off&M=off&s=off&leyning=off>

## Rules

### Duty that spans over 2 periods

A user cannot be assigned to a duty that spans over 2 periods.
For example, if a duty starts on 2024-10-20 and ends on 2024-10-30
and the proposed assignee changes role (or no longer becomes exempt)
in 2024-10-25. This is illegal and isn't possible!

The solution is to shift the next period start date before or after
the duty, depending on each particular case. We DON'T shift the duty dates
because it would cause unnecessary side effects.

#### Assignment only counts for a single period

If a user fulfilled a duty of a specific kind that requires 2 or more roles,
then the duty only grants points for a **single** role.

Consider the following example:

- There's a duty that requires either `OFFICER` or `COMMANDER`.
- Some user, which fulfilled the role `OFFICER`, was assigned to that duty
- That user then switched the role to `COMMANDER`.
- The duty shouldn't grant points when the user becomes `COMMANDER`,
  only for `OFFICER`
