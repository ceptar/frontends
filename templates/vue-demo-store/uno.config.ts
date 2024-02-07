import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  theme: {
    extend: {
      width: "width",
      height: "height",
    },
    // @see https://tailwindcss.com/docs/customizing-colors
    colors: {
      primary: {
        DEFAULT: "#212529",
        50: "#e3e7ea",
        100: "#cbd3d6",
        200: "#a6b4ba",
        300: "#7a8c96",
        400: "#5f717b",
        500: "#515f69",
        600: "#465058",
        700: "#3e454c",
        800: "#373d42",
        900:"#212529",
      },
      secondary: {
        DEFAULT: "#212529",
        50: "#e3e7ea",
        100: "#cbd3d6",
        200: "#a6b4ba",
        300: "#7a8c96",
        400: "#5f717b",
        500: "#515f69",
        600: "#465058",
        700: "#3e454c",
        800: "#373d42",
        900: "#212529",
      },
      light: {
        DEFAULT: "#5ebbff",
        200: "#e2e8f0",
      },
      dark: {
        DEFAULT: "#026ebd",
      },
      white: {
        DEFAULT: "#ffffff",
      },
      indigo: {
        DEFAULT: "#6366f1",
        50: "#f0f5ff",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
      },
      green: {
        DEFAULT: "#22c55e",
        100: "#dcfce7",
        200: "#bbf7d0",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
      },
      yellow: {
        DEFAULT: "#eab308",
        50: "#fefce8",
        300: "#fde047",
      },
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  transformers: [transformerDirectives()],
  preflights: [
    // preflights can be used to set some base styles
    {
      getCSS: () => `
      h1 {
        font-family: 'headings';
        line-height: 3rem;
        font-size: 2.8rem;
      }
      h2 {
        font-family: 'headings';
        line-height: 2.5rem;
        font-size: 2.2rem;
      }
      h3 {
        line-height: 1.5rem;
        font-size: 1.2rem;
      }
      ol,
      ul,
      dl {
        list-style-type: disc;

        margin-top: 0;
        margin-bottom: 0;
      }
      ol {
        list-style-type: decimal;
      }
      u {
        text-decoration: none;
      }
      `,
    },
  ],
});
