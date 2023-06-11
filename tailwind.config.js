const path = require("path");

module.exports = {
  content: [path.join(__dirname, "./fe-apps/src/**/*.{js,jsx,ts,tsx}")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["business"],
  },
};
