import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sampled from the Figma comps. The palette stays sparse so the work
        // itself provides the color; `accent` is the only chromatic value.
        canvas: "#ffffff",
        ink: "#1e1e1e",
        muted: "#6b6b6b",
        hairline: "#ebebeb",
        // Hot pink used for the active nav item and section headings.
        accent: "#f849c1",
        // Fill for work tiles that have no media yet.
        placeholder: "#e5e5e5",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "cursive"],
      },
      transitionTimingFunction: {
        gallery: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
