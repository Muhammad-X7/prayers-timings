type.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "import"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // 🚀 منع barrel imports من MUI
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@mui/material",
            message: "❌ استخدم الاستيراد المباشر مثل: @mui/material/Button",
          },
          {
            name: "@mui/icons-material",
            message:
              "❌ استخدم الاستيراد المباشر مثل: @mui/icons-material/AccessAlarm",
          },
        ],
      },
    ],
  },
};
