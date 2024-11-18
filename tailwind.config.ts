import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: [ "./src/**/*.tsx" ],
	theme: {
		extend: {
			fontFamily: {
				sans: [ "var(--font-geist-sans)", ...fontFamily.sans ],
			},
		},
		keyframes: {
			shimmer: {
				"100%": {
					transform: "translateX(100%)",
				},
			},
		},
	},
} satisfies Config;
