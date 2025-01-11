/** @format */

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#046200",
        secondary: "#1F316F",
        background: "#E5E8EF",
        textPrimary: "#0E1632",
        textSecondary: "#323C47",
        success: "#046200",
        error: "#AC3030",
      },
      fontFamily: {
        heading: "var(--font-arvo)",
        body: "var(--font-roboto)",
      },
    },
  },
  plugins: [],
} satisfies Config;
