/* @type {import('tailwindcss').Config}  */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      'xs': {'min': '475px'},
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        barberRed: '#C90000',
        hoverRed: '#8C0000',
        licorice: '#191516',
        carrotOrange: '#F9A03F',
        carrotOrangeHover: '#B26006'
      },
      fontFamily: {
        serif: ["PT Serif", "serif"],
       },
    },
  },
  plugins: [],
};