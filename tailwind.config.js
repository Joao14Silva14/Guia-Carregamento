/** @type {import('tailwindcss').Config} */
/* Tokens Goldenergy (iguais às variáveis CSS --ge-* definidas em src/Guia.jsx) */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ge: {
          green: "#40DDA6", blue: "#382F83", purple: "#522399", coral: "#FF6F61",
          ink: "#171424", muted: "#514D5F", soft: "#F6F4F8", line: "#D9D5E0",
          success: "#146B4F", warning: "#7A4B00", danger: "#9C2F2F",
        },
      },
      fontFamily: { brand: ['"Brandon Grotesque"', "system-ui", "sans-serif"] },
      borderRadius: { "ge-s": "0.5rem", "ge-m": "1rem", "ge-l": "1.75rem" },
      transitionTimingFunction: { ge: "cubic-bezier(.2,.8,.2,1)" },
    },
  },
  plugins: [],
};
