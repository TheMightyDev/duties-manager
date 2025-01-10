import stylistic from "@stylistic/eslint-plugin";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";

export default [ 
	...tailwind.configs["flat/recommended"],
	{
		"ignores": [
			"prisma/generated/**/*"
		],
		"languageOptions": {
			"parser": tsParser,
			"parserOptions": {
				"ecmaFeatures": {"modules": true},
				"ecmaVersion": "latest",
				"project": "./tsconfig.json"
			}
		},
		"plugins": {
			"@stylistic": stylistic,
			"@typescript-eslint": ts,
			react,
			ts,
		},
		"files": [
			"**/*.ts",
			"**/*.tsx"
		],
		"rules": {
			...ts.configs["eslint-recommended"]?.rules,
			...ts.configs["recommended"]?.rules,
			"react/jsx-no-literals": "error",
			"@stylistic/padding-line-between-statements": [
					"error",
					{
							"blankLine": "always",
							"prev": ["*"],
							"next": "return"
					},
					{
							"blankLine": "always",
							"prev": "import",
							"next": ["export"]
					}
			],
			"no-unused-vars": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{
					"prefer": "type-imports",
					"fixStyle": "inline-type-imports"
				}
			],				
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					"checksVoidReturn": {
						"attributes": false
					}
				}
			],				
			"@typescript-eslint/no-unused-vars": [
					"error",
					{
							"args": "all",
							"argsIgnorePattern": "^_",
							"caughtErrors": "all",
							"caughtErrorsIgnorePattern": "^_",
							"destructuredArrayIgnorePattern": "^_",
							"varsIgnorePattern": "^_",
							"ignoreRestSiblings": true
					}
			],
			"@typescript-eslint/prefer-nullish-coalescing": [
				"error",
				{
						"ignorePrimitives": true
				}
			],
			"@typescript-eslint/require-await": "off",
		}
	}
];
