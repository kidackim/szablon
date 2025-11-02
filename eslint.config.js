import globals from "globals";
import pluginJs from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import pluginCypress from "eslint-plugin-cypress";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  pluginJs.configs.recommended,

  // Konfiguracje bazowe TS (reguły i ustawienia parsera)
  ...compat.extends(
    "plugin:@typescript-eslint/recommended-type-checked"
  ),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
        parserOptions: {
            tsconfigRootDir: __dirname,
            project: ["cypress/tsconfig.json"], 
        },
    }
  },

{
    // Aplikuj tylko do plików testowych Cypress
    files: ["cypress/**/*.ts"],
    
    // Dodajemy wtyczkę jako bezpośredni moduł
    plugins: {
        cypress: pluginCypress
    },
    
    rules: {
        // Wszystkie reguły z 'plugin:cypress/recommended' muszą być skopiowane tutaj.
        // Poniżej kluczowe reguły:
        "cypress/no-assigning-return-values": "error",
        "cypress/no-unnecessary-waiting": "warn",
        "cypress/no-force": "warn",
        "cypress/assertion-before-screenshot": "warn",
        "cypress/require-data-selectors": "off",
        // Dodatkowe reguły:
        "no-unused-expressions": "off", 
    },
    
    // Ręczna deklaracja globalnych zmiennych Cypress/Mocha
    languageOptions: {
      globals: {
        ...globals.browser, 
        cy: "readonly", 
        Cypress: "readonly",
        expect: "readonly",
        assert: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  }
];