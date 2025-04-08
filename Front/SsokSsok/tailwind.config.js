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
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        blinkTwice: 'blinkTwice 1s ease-in-out 1',
        fadeIn: 'fadeIn 0.3s ease-out',
        floatUp: 'floatUp 1.5s ease-in-out infinite',
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
