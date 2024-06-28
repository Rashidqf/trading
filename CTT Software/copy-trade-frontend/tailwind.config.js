/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    colors: {
      primary: "#28AAE3",
      secondary: "#CBEFFF",
      warning: "#AB2727",
      regular: "#ffff",
      black: "#040501",
      grey: "#f3f4f6",
      "grey-400": "#9ca3af",
    },
    extend: {
      textColor: ["responsive", "hover", "focus", "group-hover"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
