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
        premium: "0 10px 30px rgba(0, 27, 85, 0.08)",
        card: "0 8px 24px rgba(0, 27, 85, 0.08)",
        soft: "0 5px 16px rgba(0, 27, 85, 0.08)",
      },
      fontFamily: {
        sans: ["Vazirmatn", "IRANSans", "Tahoma", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
