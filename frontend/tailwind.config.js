/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#141312',
        surface: '#201f1e',
        border: '#333230',
        primary: '#e2c4a9', // Cream / Beige
        primaryHover: '#d0b398',
        textMain: '#f7f6f2',
        textMuted: '#9b9a98',
        accentAbsent: '#e59696', // soft red
        accentPresent: '#e2c4a9', // using cream for present per Image 2
        accentExcused: '#8892b0',
        danger: '#d15b5b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
