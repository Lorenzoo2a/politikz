/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand': '#0D2159',
        'brand-light': '#1A3A7A',
        'navy-card': '#152865',
        'accent-red': '#cf2a2a',
        'primary': '#10b981',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
