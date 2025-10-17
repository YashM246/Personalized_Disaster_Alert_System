/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        critical: '#DC2626',    // red-600
        high: '#EA580C',        // orange-600
        moderate: '#F59E0B',    // amber-500
      },
    },
  },
  plugins: [],
}
