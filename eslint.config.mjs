import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "eslint-config-next/core-web-vitals";
import prettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextPlugin,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  }
);
