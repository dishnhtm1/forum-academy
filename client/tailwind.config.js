/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add custom colors that match your existing design
      colors: {
        'school-primary': '#667eea',
        'paper-white': '#ffffff',
        'gray-25': '#fcfcfd',
        'gray-50': '#f8fafc',
        'blue-50': '#eff6ff',
        'blue-500': '#3b82f6',
        'green-500': '#10b981',
        'orange-500': '#f59e0b',
        'purple-500': '#8b5cf6',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}