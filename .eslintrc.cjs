/** @type {import('prettier').Config} */
const prettierConfig = {
	arrowParens: 'avoid',
	bracketSameLine: false,
	bracketSpacing: true,
	endOfLine: 'auto',
	jsxSingleQuote: true,
	printWidth: 120,
	singleQuote: true,
	tabWidth: 3,
	trailingComma: 'all',
	useTabs: true,
};

/** @type {import('eslint-define-config').ESLintConfig} */
module.exports = {
	extends: ['plugin:@typescript-eslint/recommended', 'next/core-web-vitals'],
	overrides: [
		{ extends: ['plugin:markdown/recommended'], files: ['**/*.md', '**/*.mdx'], processor: 'markdown/markdown' },
		{
			extends: ['plugin:prettier/recommended'],
			files: ['**/*.mjs', '**/*.cjs'],
			parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
			rules: {
				'@typescript-eslint/ban-ts-comment': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'prettier/prettier': ['warn', prettierConfig],
			},
		},
		{
			extends: [
				'plugin:tailwindcss/recommended',
				'plugin:prettier/recommended',
				'plugin:import/recommended',
				'plugin:json/recommended',
			],
			files: ['**/*.ts', '**/*.tsx'],
			parserOptions: { project: './tsconfig.json', ecmaVersion: '2022', sourceType: 'module' },
			plugins: ['@typescript-eslint', 'unused-imports', 'tailwindcss'],
			rules: {
				'@typescript-eslint/comma-dangle': 'off',
				'@typescript-eslint/consistent-type-imports': 'warn',
				'@typescript-eslint/no-unused-vars': 'off',
				'import/extensions': [
					'warn',
					'ignorePackages',
					{ '': 'never', js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
				],
				'import/named': 'off',
				'import/prefer-default-export': 'off',
				'prettier/prettier': ['warn', prettierConfig],
				'react/destructuring-assignment': 'off',
				'react/jsx-props-no-spreading': 'off',
				'react/require-default-props': 'off',
				'sort-imports': [
					'warn',
					{
						allowSeparatedGroups: true,
						ignoreCase: false,
						ignoreDeclarationSort: true,
						ignoreMemberSort: false,
						memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					},
				],
				'tailwindcss/classnames-order': ['warn', { officialSorting: true }],
				'tailwindcss/no-custom-classname': 'off',
				'unused-imports/no-unused-imports': 'warn',
				'unused-imports/no-unused-vars': [
					'warn',
					{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
				],
			},
		},
	],
	parser: '@typescript-eslint/parser',
	rules: {
		'@next/next/no-html-link-for-pages': 'off',
	},
};
