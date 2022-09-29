/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}", "./remix.config.js"], // Remix.config.js has some themes for mdx parsing
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      indigo: colors.indigo,
      blue: colors.blue,
      red: colors.rose,
    },
    extend: {
      colors: {
        // Custom color for code block
        "code-dark": "#050505",
      },
    },
  },
  plugins: [],
};
