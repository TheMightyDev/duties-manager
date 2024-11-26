# Duties Manager

## Notes

### Prisma Zod Schemas generator

We use CUID2, but Prisma doesn't support it yet as a default for IDs (Zod does) - so the Zod Schemas generator validates the schemas against CUID1 instead of CUID2 - so after every DB migration, make sure to go `/orisma/generated/zod/index.ts` replace all `cuid()` with `cuid2()`
