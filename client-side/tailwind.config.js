/** @type {import('tailwindcss').Config} */
module.exports = {
  // v4 requires the NativeWind preset
  presets: [require("nativewind/preset")],
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#06145F",
        royal: "#2F5BFF",
        electric: "#4A7DFF",
        purple: "#8A3FFC",
        lavender: "#C6B6FF",
        primary: "#0B102B",
        secondary: "#5B6280",
        muted: "#8E95B2",
        "soft-gray": "#F7F8FC",
        "soft-blue": "#EEF1FF",
      },
      fontFamily: {
        poppins: ["Poppins-Regular", "sans-serif"],
        "poppins-bold": ["Poppins-Bold", "sans-serif"],
        "poppins-semi": ["Poppins-SemiBold", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
