import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Manrope"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: [
          '"DM Serif Display"',
        ],
        mono: [
          '"DM Mono"',
          '"Monaco"',
          '"Consolas"',
          '"Courier New"',
          '"ui-monospace"',
        ]
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          background: "#020617",
          default: {
            DEFAULT: "#334155",
            "50": "#0f172a",
            "100": "#1e293b",
            "200": "#334155",
            "300": "#475569",
            "400": "#64748b",
            "500": "#94a3b8",
            "600": "#cbd5e1",
            "700": "#e2e8f0",
            "800": "#f1f5f9",
            "900": "#f8fafc",
          },
          content1: "#0f172a",
          content2: "#1e293b",
          content3: "#334155",
          content4: "#475569",

        }
      }
    }
  })]
} satisfies Config;