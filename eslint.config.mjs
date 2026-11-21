import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'dist/**', 'out/**', 'next-env.d.ts'],
  },
  ...nextVitals,
  ...nextTypescript,
  {
    // Electron main process is plain CommonJS by design.
    files: ['electron/**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default config;
