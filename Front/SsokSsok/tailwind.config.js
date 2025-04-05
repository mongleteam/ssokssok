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
      keyframes: {
        blinkTwice: {
          '0%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        blinkTwice: 'blinkTwice 1s ease-in-out 1',
      },
      // ✅ 커서 유틸리티 확장
      cursor: {
        custom: "url('/cursors/cursor.png'), auto",
        pointerCustom: "url('/cursors/point_cursor.png'), pointer",
      },
    },
  },
  plugins: [],
};
