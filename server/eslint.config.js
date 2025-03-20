import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
    'simple-import-sort': importPlugin.flatConfigs.recommended
});

export default [
    {
        ignores: ['**/*.d.ts', '**/node_modules/', '**/*.js']
    },
    ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier: eslintPluginPrettier,
            'simple-import-sort': simpleImportSort,
            sonarjs,
            security
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            },

            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'commonjs',

            parserOptions: {
                source: 'module',
                project: ['tsconfig.json', 'tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname
            }
        },

        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/camelcase': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: false,
                    checksConditionals: false
                }
            ],
            '@typescript-eslint/require-await': 'warn',

            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            'sonarjs/no-duplicate-string': 'warn',
            'sonarjs/cognitive-complexity': ['warn', 15],
            'security/detect-object-injection': 'off'
        }
    }
];
