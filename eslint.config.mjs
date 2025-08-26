import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		rules: {
			// Change any type from error to warning
			'@typescript-eslint/no-explicit-any': 'warn',

			// Change unused variables from error to warning
			'@typescript-eslint/no-unused-vars': 'warn',

			// Change unused expressions from error to warning
			'@typescript-eslint/no-unused-expressions': 'warn',

			// Change empty object type from error to warning
			'@typescript-eslint/no-empty-object-type': 'warn',

			// Change missing dependencies from error to warning
			'react-hooks/exhaustive-deps': 'warn',

			// Change img element from error to warning
			'@next/next/no-img-element': 'warn',

			// Change ts-ignore comment from error to warning
			'@typescript-eslint/ban-ts-comment': 'warn',
		},
	},
];

export default eslintConfig;
