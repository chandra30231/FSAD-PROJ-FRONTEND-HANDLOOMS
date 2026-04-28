/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        themePrimary: 'var(--color-primary)',
        themeBg: 'var(--color-bg)',
        themeText: 'var(--color-text)',
      },
      // This is required for the moving images!
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      // This defines how the moving images slide!
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}