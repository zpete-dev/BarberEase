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
      ...defaultTheme.screens,
      'xs': '475px',
      /* 'lg': {'min': '950px', 'max': '1279px'}, */
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