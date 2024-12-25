# Duties Manager

## Notes

### Prisma Zod Schemas generator

We use CUID2, but Prisma doesn't support it yet as a default for IDs (Zod does) - so the Zod Schemas generator validates the schemas against CUID1 instead of CUID2 - so after every DB migration, make sure to go `/orisma/generated/zod/index.ts` replace all `cuid()` with `cuid2()`

<https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=off&mod=on&nx=off&year=now&ss=off&mf=on&c=off&M=off&s=off&leyning=off>

## How are the Jewish holidays obtained?

First we obtain them from the Hebcal REST API (which needs to be credited)
<https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=off&mod=on&nx=off&start=2023-01-01&end=2026-01-01&ss=off&mf=on&c=off&M=off&s=off&leyning=off>
