/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f7f6f1',
        ink: '#17201d',
        accent: '#e56b4d',
        brandGreen: '#314c3d',
        brandGreenLight: '#eef1eb',
      },
    },
  },
  plugins: [],
}
