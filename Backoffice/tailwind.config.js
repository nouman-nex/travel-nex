/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1160px",
        "2xl": "1280px",
        "3xl": "1536px",
        "4xl": "1920px",
      },
      fontFamily: {
        nunito: ['"Nunito Sans"', "sans-serif"],
        arial: ["Arial", "sans-serif"],
      },
      colors: {
        primary: "#7DD3FC",
        hover: "#988960",
      },
    },
  },
  plugins: [],
};
