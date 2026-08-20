import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7fafc",
        "on-background": "#181c1e",
        surface: {
          DEFAULT: "#f7fafc",
          dim: "#d7dadc",
          bright: "#f7fafc",
          lowest: "#ffffff",
          low: "#f1f4f6",
          container: "#ebeef0",
          high: "#e5e9eb",
          highest: "#e0e3e5",
          variant: "#e0e3e5",
        },
        "on-surface": {
          DEFAULT: "#181c1e",
          variant: "#43474e",
        },
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eef1f3",
        outline: {
          DEFAULT: "#74777f",
          variant: "#c4c6cf",
        },
        "surface-tint": "#455f88",
        primary: {
          DEFAULT: "#002045",
          container: "#1a365d",
          "on-container": "#86a0cd",
          "on-primary": "#ffffff",
          fixed: "#d6e3ff",
          "fixed-dim": "#adc7f7",
          "on-fixed": "#001b3c",
          "on-fixed-variant": "#2d476f",
        },
        secondary: {
          DEFAULT: "#555f71",
          container: "#d6e0f6",
          "on-container": "#596376",
          "on-secondary": "#ffffff",
          fixed: "#d9e3f9",
          "fixed-dim": "#bdc7dc",
          "on-fixed": "#121c2c",
          "on-fixed-variant": "#3d4759",
        },
        tertiary: {
          DEFAULT: "#002625",
          teal: "#319795",
          container: "#003d3c",
          "on-container": "#4cadab",
          "on-tertiary": "#ffffff",
          fixed: "#94f2f0",
          "fixed-dim": "#77d6d3",
          "on-fixed": "#00201f",
          "on-fixed-variant": "#00504e",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          "on-container": "#93000a",
          "on-error": "#ffffff",
        },
        attendance: {
          present: {
            bg: "#E6FFFA",
            badge: "#B2F5EA",
            border: "#81E6D9",
            text: "#004D40",
            dot: "#319795",
          },
          absent: {
            bg: "#FFF5F5",
            badge: "#FED7D7",
            border: "#FEB2B2",
            text: "#9B2C2C",
            dot: "#E53E3E",
          },
          late: {
            bg: "#FFFAF0",
            badge: "#FEEBC8",
            border: "#FBD38D",
            text: "#975A16",
            dot: "#DD6B20",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        telugu: ["var(--font-telugu)", "system-ui", "sans-serif"],
        hindi: ["var(--font-devanagari)", "system-ui", "sans-serif"],
        devanagari: ["var(--font-devanagari)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "elevation-1": "0 4px 6px -1px rgba(26, 54, 93, 0.05), 0 2px 4px -1px rgba(26, 54, 93, 0.03)",
        "elevation-2": "0 20px 25px -5px rgba(26, 54, 93, 0.1), 0 10px 10px -5px rgba(26, 54, 93, 0.04)",
        "glow-teal": "0 0 0 3px rgba(49, 151, 149, 0.2)",
        "glow-primary": "0 0 0 3px rgba(26, 54, 93, 0.2)",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
