// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        whitechalk: ['Whitechalk', 'sans-serif'],
        ganpan: ['KccGanpan', 'sans-serif'],
        dodam: ['KccDodam', 'sans-serif'],
        cafe24: ['Cafe24', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
