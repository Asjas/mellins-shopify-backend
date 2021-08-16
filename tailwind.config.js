module.exports = {
  mode: "jit",
  purge: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: "#445a6a",
        secondary: "#fcfcfc",
      },
      fontFamily: {
        display: "'MerriWeather', serif",
        body: "'PT Sans', sans-serif",
      },
      fontSize: {
        tiny: "1.4rem",
        sm: "1.5rem",
        base: "1.6rem",
        lg: "1.8rem",
        "2xl": "2.25rem",
        "3xl": "3rem",
      },
    },
  },
  plugins: [require("@tailwindcss/ui")],
};
