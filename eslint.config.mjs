import js from '@eslint/js';
import markdown from '@eslint/markdown';
import html from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import prettier from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const scriptFiles = ['**/*.{js,mjs,jsx,ts,tsx}'];
const scoped = (configs, files) => configs.map((config) => ({ ...config, files }));
const tsRules = Object.assign({}, ...tseslint.configs.recommended.map((config) => config.rules));

export default [
  { ignores: ['dist/', '.astro/', 'prototypes/', 'node_modules/'] },

  { ...js.configs.recommended, files: scriptFiles },
  ...scoped(tseslint.configs.recommended, ['**/*.{ts,tsx}']),
  { files: scriptFiles, languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { ...reactHooks.configs.flat.recommended, files: ['**/*.{jsx,tsx}'] },

  ...astro.configs.recommended,
  // astro の推奨設定にはJS・TSのルールが含まれないので、フロントマターと script にも適用する
  {
    files: ['**/*.astro', '**/*.astro/*.{js,ts}'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { ...js.configs.recommended.rules, ...tsRules },
  },

  {
    ...html.configs.recommended,
    files: ['**/*.html'],
    plugins: { html },
    languageOptions: { parser: htmlParser },
    language: 'html/html',
    rules: {
      ...html.configs.recommended.rules,
      // 整形はPrettierに任せる
      'html/attrs-newline': 'off',
      'html/element-newline': 'off',
      'html/indent': 'off',
      'html/no-extra-spacing-tags': 'off',
      'html/quotes': 'off',
      'html/require-closing-tags': 'off',
    },
  },

  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    rules: {
      ...markdown.configs.recommended[0].rules,
      // SPEC.md のワイヤーフレームは言語を持たないコードブロックで書いている
      'markdown/fenced-code-language': 'off',
    },
  },

  prettier,
];
