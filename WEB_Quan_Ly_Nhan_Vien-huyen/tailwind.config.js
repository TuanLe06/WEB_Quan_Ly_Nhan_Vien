/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // QUAN TRỌNG: Quét toàn bộ file trong src
  ],
  theme: {
    extend: {
      // Định nghĩa Font chữ mặc định là Inter
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Định nghĩa Animation (Keyframes)
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' }, // Bắt đầu: mờ và thấp hơn 10px
          '100%': { opacity: '1', transform: 'translateY(0)' },  // Kết thúc: rõ và về vị trí gốc
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      // Đăng ký tên class để dùng: className="animate-fade-in"
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}