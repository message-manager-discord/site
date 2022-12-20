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
      purple: colors.purple,
      blue: colors.blue,
      red: colors.rose,
      green: colors.green,
    },
    extend: {
      colors: {
        "code-dark": "#050505",
      },
    },
  },
  // This is for the toasts - which color styles are handled programmatically
  safelist: [
    "bg-red-100",
    "dark:bg-red-200",
    "border-red-400",
    "text-red-700",
    "dark:text-red-800",
    "text-red-500",
    "focus:ring-red-400",
    "hover:bg-red-200",
    "dark:text-red-600",
    "dark:hover:bg-red-300",
    "bg-green-100",
    "dark:bg-green-200",
    "border-green-400",
    "text-green-700",
    "dark:text-green-800",
    "text-green-500",
    "focus:ring-green-400",
    "hover:bg-green-200",
    "dark:text-green-600",
    "dark:hover:bg-green-300",
    "bg-blue-100",
    "dark:bg-blue-200",
    "border-blue-400",
    "text-blue-700",
    "dark:text-blue-800",
    "text-blue-500",
    "focus:ring-blue-400",
    "hover:bg-blue-200",
    "dark:text-blue-600",
    "dark:hover:bg-blue-300",
    "bg-slate-100",
    "dark:bg-slate-200",
    "border-slate-400",
    "text-slate-700",
    "dark:text-slate-800",
    "text-slate-500",
    "focus:ring-slate-400",
    "hover:bg-slate-200",
    "dark:text-slate-600",
    "dark:hover:bg-slate-300",
  ],
  plugins: [],
};
