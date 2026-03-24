/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ea580c",
          dark: "#c2410c",
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        success: "#059669",
        warning: "#d97706",
        "background-light": "#f9fafb",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "glow-orange": "0 0 20px 4px rgba(234, 88, 12, 0.18)",
        "glow-sm": "0 0 12px 2px rgba(234, 88, 12, 0.12)",
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px -6px rgba(234, 88, 12, 0.14), 0 2px 8px -2px rgba(0,0,0,0.06)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      transitionDuration: {
        250: "250ms",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.25, 1, 0.5, 1) both",
        "float": "float 6s ease-in-out infinite",
        "pulse-ring": "pulseRing 1.8s ease-out infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "gradient": "gradient 5s ease infinite",
      },
    },
  },
  plugins: [],
};
