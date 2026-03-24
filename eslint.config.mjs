// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginBoundaries from 'eslint-plugin-boundaries';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const promiseFlatRecommended =
  /** @type {any} */ (eslintPluginPromise).configs['flat/recommended'];

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'eslint.config.mjs'
    ],
  },
  eslint.configs.recommended,
  promiseFlatRecommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  
  {
    plugins: {
      import: eslintPluginImport,
      boundaries: eslintPluginBoundaries,
      sonarjs: eslintPluginSonarjs,
      // promise: eslintPluginPromise,
      'unused-imports': eslintPluginUnusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      'import/resolver': {
        typescript: true,
      },

      'boundaries/elements': [
        { type: 'controller', pattern: 'src/**/controllers/*' },
        { type: 'service', pattern: 'src/**/services/*' },
        { type: 'repository', pattern: 'src/**/repositories/*' },
        { type: 'domain', pattern: 'src/**/domain/*' },
        { type: 'dto', pattern: 'src/**/dto/*' },
        { type: 'common', pattern: 'src/common/*' },
      ],
    },

    rules: {
      /*
       * TypeScript / segurança
       */
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      /*
       * Imports / acoplamento
       */
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],

      /*
       * Arquitetura / boundaries
       */
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'controller',
              allow: ['service', 'dto', 'common'],
            },
            {
              from: 'service',
              allow: ['repository', 'domain', 'dto', 'common'],
            },
            {
              from: 'repository',
              allow: ['domain', 'common'],
            },
            {
              from: 'domain',
              allow: ['domain', 'common'],
            },
          ],
        },
      ],

      /*
       * Complexidade
       */
      'complexity': ['warn', 10],
      'sonarjs/cognitive-complexity': ['warn', 15],
      'max-depth': ['warn', 3],
      'max-lines-per-function': [
        'warn',
        {
          max: 80,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      /*
       * Imports não usados
       */
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'promise/catch-or-return': 'warn',
      'promise/no-return-wrap': 'error',

      /*
       * Prettier
       */
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'max-lines-per-function': 'off',
    },
  },
);
