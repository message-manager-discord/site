module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.css'
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      inset: ["checked"],
    },
  },
  plugins: [],
}
