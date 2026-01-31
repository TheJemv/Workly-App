const themes = require("./config/theme.json")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: themes.colors.default.text_color.default,
        light: themes.colors.default.text_color.light,
        dark: themes.colors.default.text_color.dark,
        primary: "#354671",
        secondary: themes.colors.default.theme_color.secondary,
        body: themes.colors.default.theme_color.body,
        border: themes.colors.default.theme_color.border,
        "theme-light": themes.colors.default.theme_color.theme_light,
        "theme-dark": themes.colors.default.theme_color.theme_dark,
        darkmode: {
          text: themes.colors.darkmode.text_color.default,
          light: themes.colors.darkmode.text_color.light,
          dark: themes.colors.darkmode.text_color.dark,
          primary: "#354671",
          secondary: themes.colors.darkmode.theme_color.secondary,
          body: themes.colors.darkmode.theme_color.body,
          border: themes.colors.darkmode.theme_color.border,
          "theme-light": themes.colors.darkmode.theme_color.theme_light,
          "theme-dark": themes.colors.darkmode.theme_color.theme_dark,
        },
      }
    },
  },
  plugins: [],
}

