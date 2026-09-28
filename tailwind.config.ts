import type { Config } from "tailwindcss";

// Tokens come straight from docs/DESIGN.md. Do not add colors here without
// updating that table first — Cobalt is the only accent.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8FA",
        surface: "#FFFFFF",
        ink: "#14171C",
        graphite: "#5A6170",
        rule: "#E2E5EA",
        cobalt: "#2344D0",
        live: "#1C7C54",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // DESIGN.md scale, in rem
        sm: ["0.875rem", { lineHeight: "1.6" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.5" }],
        xl: ["1.563rem", { lineHeight: "1.25" }],
        "2xl": ["1.953rem", { lineHeight: "1.15" }],
        "3xl": ["2.441rem", { lineHeight: "1.1" }],
        hero: ["3.815rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        content: "1120px",
        reading: "680px",
        measure: "68ch",
      },
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
