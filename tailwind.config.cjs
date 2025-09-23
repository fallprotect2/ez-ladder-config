/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.{ts,tsx,js,jsx}",              // pick up root-level files like main.tsx, ui-shim.tsx, etc.
    "./{src,components}/**/*.{ts,tsx,js,jsx}" // optional: future subfolders
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
    },
  },
  plugins: [],
};
