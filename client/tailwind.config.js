/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#ff385c",
          dark: "#d70466",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -15px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
};
