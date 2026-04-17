import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rule overrides
  {
    rules: {
      // Downgrade to warning — setState in effect is a valid pattern
      // for synchronizing derived state (e.g. auto-generating slugs, URL params).
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);

export default eslintConfig;
