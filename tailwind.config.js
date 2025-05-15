/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF8F1',
          100: '#F8F1E0',
          200: '#F0E4C0',
          300: '#E8D7A0',
          400: '#DFCA80',
          500: '#D4AF37', // Main gold color
          600: '#BF9C30',
          700: '#A68828',
          800: '#8C7322',
          900: '#735F1C',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};