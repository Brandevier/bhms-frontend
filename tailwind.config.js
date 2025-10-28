/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: "#19417D", // Dark Blue
        secondary: "#1E40AF", // Lighter Blue
        accent: "#F59E0B", // Amber
        muted: "#6B7280", // Gray
        background: "#F3F4F6", // Light Gray Background
        danger: "#DC2626", // Red
        success: "#16A34A", // Green
      },
    },
  },
  plugins: [],
};
