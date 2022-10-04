/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    extend: {
      fontFamily: {
        sukhumvit: ["SukhumvitSet", "sans-serif"],
        sukhumvit_bold: ["SukhumvitSet-Bold", "bold"],
        sukhumvit_med:["SukhumvitSet-Medium", "med"],
      },
      minHeight: {
        'test': '450px',
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ],
}
