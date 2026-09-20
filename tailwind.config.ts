import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#001B55",
        deepNavy: "#001247",
        royal: "#003B95",
        gold: "#D9B854",
        buttonGold: "#E6AA35",
        page: "#F8FAFD",
        softBlue: "#EEF5FF",
        borderBlue: "#E4ECF7",
        textNavy: "#00194F",
        muted: "#6B7894",
      },
      boxShadow: {
        premium: "0 18px 50px rgba(0, 27, 85, 0.10), 0 2px 8px rgba(0, 27, 85, 0.05)",
        card: "0 12px 32px rgba(0, 27, 85, 0.08), 0 2px 6px rgba(0, 27, 85, 0.04)",
        soft: "0 7px 20px rgba(0, 27, 85, 0.07)",
      },
      fontFamily: {
        sans: ["Vazirmatn", "IRANSans", "Tahoma", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
