# Duties Manager

## Notes

### For developing and contributing

#### Installing and configuring VSCode

We use VSCode for development

Install the following extensions:

- Git Lens
- Prisma by prisma.io - Adds syntax highlighting, formatting, auto-completion, jump-to-definition and linting for .prisma files.
- Tailwind CSS - Intelligent Tailwind CSS tooling for VS Code
- ESLint by Microsoft
- Prettier - Code formatter
- Code Spell Checker
- Hebrew Code Spell Checker
- Pretty TypeScript Errors by yoavbls

Set the following `.vscode/settings.json` (Click `F1` and then enter "Preferences: Open Workspace Settings (JSON)")

```json
{
	"editor.indentSize": 2,
	"eslint.useFlatConfig": true,
	"editor.codeActionsOnSave": {
		"source.organizeImports": "always",
		"source.fixAll.eslint": "always"
	},
	"files.associations": {
		"*.css": "tailwindcss"
	},
	"editor.quickSuggestions": {
		"strings": "on"
	},
	"tailwindCSS.experimental.classRegex": [
		"[a-zA-Z]*ClassName='([^']+)'",
		"[a-zA-Z]*ClassName=\"([^\"]+)\"",
		"[a-zA-Z]*ClassName={`([^`]+)`}"
	],
	"html-css-class-completion.excludeGlobPattern": "{node_modules,doc,docs,.bundle,vendor,.next}/**",
	"cSpell.words": [
		"daygrid",
		"fullcalendar",
		"toastify"
	],
	"typescript.preferences.autoImportFileExcludePatterns": [
		"@radix-ui"
	],
	"[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
		"editor.formatOnSave": true
  },
	"[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
		"editor.formatOnSave": true
  },
}
```

#### More set up and firing the DB

- Node.js v22
- Latest docker
- git
- Run the Docker engine
- We only use the git bash shell for developing, so from a git bash terminal run:

```bash
./start-database.sh
```

- To run the code, run from a git bash terminal

```bash
npm run dev
```

#### Contributing guidelines

- To contribute branch out to a new branch from dev, and then propose an MR to dev
- Make sure each MR is focused and only makes relevant changes

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
