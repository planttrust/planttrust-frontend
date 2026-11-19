import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Module boundaries: a module may use another module only through its api.ts and types.ts.
    files: ['src/modules/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/modules/m[1-5]-*/*',
                '!@/modules/m[1-5]-*/api',
                '!@/modules/m[1-5]-*/types',
                '**/m[1-5]-*/*',
                '!**/m[1-5]-*/api',
                '!**/m[1-5]-*/types',
              ],
              message:
                "Use another module only through its api.ts or types.ts (e.g. '@/modules/m4-geofencing/api').",
            },
          ],
        },
      ],
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
