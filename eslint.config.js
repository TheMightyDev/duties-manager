import stylistic from "@stylistic/eslint-plugin";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import tailwind from "eslint-plugin-tailwindcss";

export default [ 
	...tailwind.configs["flat/recommended"],
	// stylistic.configs["all-flat"],
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
			ts,
		},
		"files": [
			"**/*.ts",
			"**/*.tsx"
		],
		"rules": {
			...ts.configs["eslint-recommended"]?.rules,
			...ts.configs["recommended"]?.rules,
			"@stylistic/array-bracket-newline": [
					"error",
					"consistent"
			],
			"@stylistic/array-bracket-spacing": [
					"error",
					"always"
			],
			"@stylistic/array-element-newline": [
					"error",
					"consistent"
			],
			"@stylistic/arrow-spacing": [
					"error",
					{
							"before": true,
							"after": true
					}
			],
			"@stylistic/brace-style": [
					"error",
					"1tbs"
			],
			"@stylistic/block-spacing": [
					"error",
					"always"
			],
			"@stylistic/comma-dangle": [
					"error",
					{
							"arrays": "always-multiline",
							"objects": "always-multiline",
							"imports": "only-multiline",
							"exports": "never",
							"functions": "never",
							"enums": "always-multiline",
							"generics": "ignore"
					}
			],
			"@stylistic/comma-spacing": [
					"error",
					{
							"before": false,
							"after": true
					}
			],
			"@stylistic/eol-last": [
					"error",
					"always"
			],
			"@stylistic/function-call-argument-newline": [
					"error",
					"consistent"
			],
			"@stylistic/function-call-spacing": [
					"error",
					"never"
			],
			"@stylistic/function-paren-newline": [
					"error",
					"consistent"
			],
			"@stylistic/indent": [
					"error",
					"tab"
			],
			"@stylistic/indent-binary-ops": [
					"error",
					"tab"
			],
			"@stylistic/jsx-closing-bracket-location": [
					"error",
					{
							"nonEmpty": "tag-aligned",
							"selfClosing": "tag-aligned"
					}
			],
			"@stylistic/jsx-first-prop-new-line": [
					"error",
					"multiline-multiprop"
			],
			"@stylistic/jsx-max-props-per-line": [
					"error",
					{
							"maximum": 1,
							"when": "always"
					}
			],
			"@stylistic/jsx-quotes": [
					"error",
					"prefer-double"
			],
			"@stylistic/key-spacing": [
					"error",
					{
							"beforeColon": false
					}
			],
			"@stylistic/keyword-spacing": ["error"],
			"@stylistic/linebreak-style": [
					"error",
					"windows"
			],
			"@stylistic/max-statements-per-line": [
					"error",
					{
							"max": 1
					}
			],
			"@stylistic/no-floating-decimal": ["error"],
			"@stylistic/no-mixed-spaces-and-tabs": ["error"],
			"@stylistic/no-multi-spaces": ["error"],
			"@stylistic/no-multiple-empty-lines": [
					"error",
					{
							"max": 1
					}
			],
			"@stylistic/no-trailing-spaces": [
					"error",
					{
							"skipBlankLines": true
					}
			],
			"@stylistic/object-curly-newline": [
					"error",
					{
							"ObjectExpression": {
									"multiline": true,
									"minProperties": 1
							},
							"ObjectPattern": {
									"multiline": true
							},
							"ImportDeclaration": {
									"multiline": true
							},
							"ExportDeclaration": "never"
					}
			],
			"@stylistic/object-curly-spacing": [
					"error",
					"always"
			],
			"@stylistic/object-property-newline": ["error"],
			"@stylistic/quotes": [
					"error",
					"double"
			],
			"@stylistic/padded-blocks": [
					"error",
					"never"
			],
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
			"@stylistic/semi": ["error"],
			"@stylistic/space-infix-ops": ["error"],
			"@stylistic/member-delimiter-style": [
					"error",
					{
							"multiline": {
									"delimiter": "semi",
									"requireLast": true
							},
							"singleline": {
									"delimiter": "semi",
									"requireLast": false
							},
							"multilineDetection": "brackets"
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
