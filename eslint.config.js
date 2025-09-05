const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = [
  // Objeto de configuração para ignorar arquivos e pastas
  {
    ignores: ["dist/", "node_modules/", "jest.config.js", "jest.setup.js"],
  },
  
  // "Espalha" (spread) todas as configurações recomendadas pelo typescript-eslint
  // Cada item do array 'recommended' se torna um item no nosso array principal.
  ...tseslint.configs.recommended,
  
  // Nosso objeto de configurações customizadas, como um item separado no array
  {
    files: ["src/**/*.ts"], // Garante que estas regras só se apliquem a arquivos TS
    languageOptions: {
      globals: {
        ...globals.node, // Adiciona os globais do Node.js (ex: process, console)
      },
    },
    rules: {
      // Aqui você pode adicionar ou sobrescrever regras
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];