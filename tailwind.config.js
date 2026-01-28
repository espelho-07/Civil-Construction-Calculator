/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B68FC',
        'primary-hover': '#2a4add',
        'bg-body': '#F7F9FF',
        'bg-card': '#f8f9fa',
        'text-primary': '#0A0A0A',
        'text-secondary': '#6b7280',
        'border-color': '#e5e7eb',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
}
