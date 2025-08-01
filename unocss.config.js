import { defineConfig, presetUno, presetTypography, transformerVariantGroup } from 'unocss'

export default defineConfig({
	presets: [
		presetUno({ dark: "class" }),
		presetTypography({
			cssExtend: {
				a: {
					"text-decoration": "none",
				},
				"p > a, li > a": {
					position: "relative",
					display: "inline-block",
					"z-index": 5,
					"background-image":
					"linear-gradient(var(--c-prose-accent), var(--c-prose-accent))",
					"background-size": "0 2px",
					"background-repeat": "no-repeat",
					"background-position": "bottom left",
					transition: "background-size ease-out 200ms",
				},
				"p > a:hover, li > a:hover": {
					"background-size": "100% 2px",
				},
				strong: {
					color: "var(--un-prose-headings)",
				},
				p: {
					"font-family": "var(--font-serif)",
					"line-height": "1.625",
				},
				h1: {
					"text-transform": "uppercase",
					"font-weight": 700,
					"font-size": "1.875rem",
					"background-image": `linear-gradient(to right, var(--c-prose-accent), rgba(0, 0, 0, 0))`,
					"background-size": "100% 0.125rem",
					"background-repeat": "no-repeat",
					"background-position": "bottom",
					"padding-bottom": "0.5rem",
				},
				h2: {
					"font-size": "1.5rem",
				},
				h3: {
					"font-size": "1.25rem",
				},
				h4: {
					"font-size": "1.125rem",
				},
				"h1, h2, h3, h4, h5, h6": {
					"font-family": "var(--font-heading)",
					position: "relative",
				},
				"h1 a, h2 a, h3 a, h4 a, h5 a": {
					"font-weight": 600,
				},
				"p > code": {
					color: "var(--un-prose-headings)",
					"font-family": "var(--font-monospace)",
					"background-color": "var(--c-prose-alt-bg)",
					"font-weight": 500,
					border: "none",
				},
				pre: {
					"font-family": "var(--font-monospace)",
					padding: "1rem",
					"margin-top": "1.25rem",
					"overflow-x": "auto",
					"border-radius": "0.375rem",
				},
				table: {
					width: "100%",
					"border-radius": "0.375rem",
					"background-color": "var(--c-prose-alt-bg)",
				},
			},
		}),
	],
	transformers: [transformerVariantGroup()],
	rules: [
		[
			/^content-\[(.*)\]$/,
			([, content]) => ({ content: JSON.stringify(content) }),
		],
		[
			/^prose-custom$/,
			(_, { theme }) => ({
				"--font-heading": '"Space Grotesk", sans-serif',
				"--font-serif": '"IBM Plex Serif", serif',
				"--font-monospace": '"IBM Plex Mono", monospace',
				"--un-prose-body": theme.colors.zinc[800],
				"--un-prose-links": theme.colors.rose[700],
				"--un-prose-headings": theme.colors.zinc[800],
				"--c-prose-accent": theme.colors.rose[600],
				"--c-prose-alt-bg": theme.colors.rose[100],
				"--c-prose-scrollbar-bg": theme.colors.gray[200],
				"--c-prose-thumb-bg": theme.colors.gray[300],
			}),
			{ layer: "typography" },
		],
		[
			/^prose-custom-dark$/,
			(_, { theme }) => ({
				".dark &": {
					"--un-prose-body": theme.colors.zinc[200],
					"--un-prose-links": theme.colors.rose[400],
					"--un-prose-headings": theme.colors.zinc[100],
					"--c-prose-accent": theme.colors.rose[500],
					"--c-prose-alt-bg": theme.colors.zinc[800],
					"--c-prose-scrollbar-bg": theme.colors.zinc[700],
					"--c-prose-thumb-bg": theme.colors.zinc[600],
				}
			}),
			{ layer: "typography" },
		],
		[
			/^custom-scrollbar$/,
			(_, { theme }) => {
				const styles = {
					'scroll-padding-top': '2rem',
				}
				const scrollbarStyles = {
					'&::-webkit-scrollbar-thumb': {
						'background-color': theme.colors.rose[600],
					},
					'&::-webkit-scrollbar': {
						'background-color': theme.colors.rose[200],
						'width': '0.5rem',
					},
					'.dark &::-webkit-scrollbar-thumb': {
						'background-color': theme.colors.rose[500],
					},
					'.dark &::-webkit-scrollbar': {
						'background-color': theme.colors.zinc[800],
					}
				}
				return { ...styles, ...scrollbarStyles }
			},
			{ layer: "default" },
		],
	],
	shortcuts: [
		[
			/^btn-lg-(.*)$/,
			([, c]) => {
				return `bg-${c} inline-block
mt-8 px-5 py-2
text-white font-semibold no-underline font-heading text-lg tracking-wide
transition-property-transform ease-out duration-200 transform-gpu
shadow-sharp border-2 border-rose-900
hover:(-translate-y-1.5)
`;
			},
		],
		[
			/^btn-(source|demo)$/,
			([, kind]) => {
				const colour =
					kind === "demo" ? "bg-rose-600 text-white" : "bg-white text-zinc-900 dark:(bg-zinc-800 text-zinc-100)";
				return `${colour} border-2 border-rose-900 dark:border-rose-600 shadow-sharp font-heading no-underline flex items-center gap-2 py-1 px-3 transition-property-filter ease-out duration-200 hover:brightness-90`;
			},
		],
	],
	theme: {
		fontFamily: {
			heading: ["Space Grotesk", "sans-serif"],
			serif: ["IBM Plex Serif", "serif"],
			monospace: ["IBM Plex Mono", "monospace"],
		},
		fontSize: {
			"clamped-lg": "clamp(1.25rem, calc(5vw + 1.25rem), 3rem)",
			"clamped-md": "clamp(1rem, calc(5vw + 0.5rem), 1.625rem)",
			"clamped-sm": "clamp(0.8rem, calc(2vw + 0.5rem), 1.125rem)",
		},
		width: {
			clamped: "clamp(12rem, calc(20vw + 4rem), 16rem)",
		},
		height: {
			clamped: "clamp(12rem, calc(20vw + 4rem), 16rem)",
		},
		boxShadow: {
			sharp: '0.25rem 0.25rem 0 0 #881337',
		},
	},
	preflights: [
		{
			getCSS: ({ theme }) => `
*::selection {
background-color: ${theme.colors.zinc[800]};
color: ${theme.colors.white};
}

.dark *::selection {
background-color: ${theme.colors.rose[400]};
color: ${theme.colors.zinc[900]};
}`,
		},
	],
});

// Add custom scrollbar styles as raw CSS
export const preflights = [
  {
    getCSS: ({ theme }) => `
      .custom-scrollbar {
        scroll-padding-top: 2rem;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: ${theme.colors.rose[600]};
      }
      .custom-scrollbar::-webkit-scrollbar {
        background-color: ${theme.colors.rose[200]};
        width: 0.5rem;
      }
      .dark .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: ${theme.colors.rose[500]};
      }
      .dark .custom-scrollbar::-webkit-scrollbar {
        background-color: ${theme.colors.zinc[800]};
      }
    `
  }
];
