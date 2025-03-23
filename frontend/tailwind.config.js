/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class", "media"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Use function-based syntax for CSS variable colors.
        background: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--background) / ${opacityValue})`
            : "hsl(var(--background))",
        foreground: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--foreground) / ${opacityValue})`
            : "hsl(var(--foreground))",
        card: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--card) / ${opacityValue})`
            : "hsl(var(--card))",
        "card-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--card-foreground) / ${opacityValue})`
            : "hsl(var(--card-foreground))",
        popover: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--popover) / ${opacityValue})`
            : "hsl(var(--popover))",
        "popover-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--popover-foreground) / ${opacityValue})`
            : "hsl(var(--popover-foreground))",
        primary: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--primary) / ${opacityValue})`
            : "hsl(var(--primary))",
        "primary-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--primary-foreground) / ${opacityValue})`
            : "hsl(var(--primary-foreground))",
        secondary: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--secondary) / ${opacityValue})`
            : "hsl(var(--secondary))",
        "secondary-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--secondary-foreground) / ${opacityValue})`
            : "hsl(var(--secondary-foreground))",
        destructive: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--destructive) / ${opacityValue})`
            : "hsl(var(--destructive))",
        "destructive-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--destructive-foreground) / ${opacityValue})`
            : "hsl(var(--destructive-foreground))",
        muted: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--muted) / ${opacityValue})`
            : "hsl(var(--muted))",
        "muted-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--muted-foreground) / ${opacityValue})`
            : "hsl(var(--muted-foreground))",
        accent: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--accent) / ${opacityValue})`
            : "hsl(var(--accent))",
        "accent-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--accent-foreground) / ${opacityValue})`
            : "hsl(var(--accent-foreground))",
        popover: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--popover) / ${opacityValue})`
            : "hsl(var(--popover))",
        "popover-foreground": ({ opacityValue }) =>
          opacityValue !== undefined
            ? `hsl(var(--popover-foreground) / ${opacityValue})`
            : "hsl(var(--popover-foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
