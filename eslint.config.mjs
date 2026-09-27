import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // Explicit version: eslint-plugin-react's auto-detection doesn't support ESLint 10 yet.
    settings: { react: { version: '19.3' } },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'coverage/**'],
  },
];

export default config;
