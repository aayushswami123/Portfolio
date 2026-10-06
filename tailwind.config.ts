import type { Config } from "tailwindcss";

// Tokens come straight from docs/DESIGN.md. Do not add colors here without
// updating that table first — Accent is the only accent.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#F8F8F6",
        card: "#FFFFFF",
        inset: "#F1F3F6",
        ink: "#0F0F0F",
        graphite: "#5E6168",
        rule: "#E6E6E2",
        accent: "#6C47FF",
        "accent-soft": "#F1EDFF",
        live: "#1C7C54",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.6" }],
        // 16px on mobile, 17px from lg up (the variable is set in globals.css).
        base: ["var(--text-body)", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.4" }],
        xl: ["1.5rem", { lineHeight: "1.3" }],
        "2xl": ["1.75rem", { lineHeight: "1.2" }],
        "3xl": ["2.5rem", { lineHeight: "1.1" }],
        name: ["2.75rem", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "name-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
      },
      maxWidth: {
        content: "1120px",
        // 1120 content + 136 gutter + 32 gap + 64 padding, at >=1280px
        wide: "1352px",
        reading: "680px",
        measure: "68ch",
      },
      borderRadius: {
        DEFAULT: "6px",
        btn: "10px",
        panel: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
