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
			colors: {
				"role-squad": "#8843F2",
				"role-officer": "#59D5E0",
				"role-commander": "#FAA300",
				"role-exempt": "#F4538A",
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
