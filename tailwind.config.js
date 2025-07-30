/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
      },
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #4f46e5, #4338ca)",
      },
    },
  },
  plugins: [],
};
