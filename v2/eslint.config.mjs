import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      jsdoc,
    },
    settings: {
      jsdoc: {
        mode: "typescript",
        tagNamePreference: {
          returns: "returns",
          augments: "extends",
        },
      },
    },
    rules: {
      // Enhanced accessibility rules for WCAG 2.2 Level AA compliance
      // Note: Next.js already includes jsx-a11y plugin, we're enhancing the rules
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "error",

      // JSDoc documentation requirements - enforce comprehensive documentation
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          contexts: [
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "TSEnumDeclaration",
          ],
          exemptEmptyFunctions: false,
          checkConstructors: true,
        },
      ],
      "jsdoc/require-description": [
        "error",
        {
          contexts: ["any"],
          descriptionStyle: "body",
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off", // TypeScript provides types
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off", // TypeScript provides types
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "off", // TypeScript handles this
      "jsdoc/no-undefined-types": "off", // TypeScript handles this
      "jsdoc/valid-types": "off", // TypeScript handles this
      "jsdoc/check-alignment": "warn",
      "jsdoc/check-indentation": "warn",
      "jsdoc/multiline-blocks": "warn",
      "jsdoc/tag-lines": ["warn", "any", { startLines: 1 }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
