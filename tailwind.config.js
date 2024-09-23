/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter']
      },
      keyframes: {
        typing: {
          '0%': { transform: 'scale(1)', opacity: 0 },
          '50%': { transform: 'scale(1.2)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 0 }
        }
      },
      animation: {
        'typing': 'typing 1s infinite'
      }
    },
  },
  plugins: [],
}
