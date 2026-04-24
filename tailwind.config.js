/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'anonymous-black': '#0a0a0a',
        'anonymous-green': '#00ff00',
        'anonymous-gray': '#1a1a1a',
      }
    },
  },
  plugins: [],
}
