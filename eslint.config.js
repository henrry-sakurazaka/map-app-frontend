import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['dist', 'node_modules'],
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    plugins: {
      js,
      react: pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
    },

    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // react-hooks は “config継承しない”
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
