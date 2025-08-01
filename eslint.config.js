import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./ui/tsconfig.json'],
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      // Add or override rules here
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];
