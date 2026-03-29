import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import html from 'eslint-plugin-html';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'pages_backup_mess/**', 'assets/**', '.claude/**'],
  },
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js', '**/*.html'],
    plugins: {
      html,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        THREE: 'readonly',
        __BUILD_DATE__: 'readonly',
        gsap: 'readonly',
        Matter: 'readonly',
        PhotoSwipe: 'readonly',
        PhotoSwipeUI_Default: 'readonly',
        Runner: 'readonly',
        engine: 'readonly',
        runner: 'readonly',
        initPhotoSwipe: 'readonly',
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-undef': 'warn', // Downgrade to warn for now since there are many global scripts
      'no-case-declarations': 'off',
    },
  },
];
