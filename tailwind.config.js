/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
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
        "code-dark": "#050505",
      },
    },
  },
  plugins: [],
};
