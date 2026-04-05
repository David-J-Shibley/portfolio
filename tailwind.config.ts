import type { Config } from "tailwindcss";

export default {
	darkMode: 'class',
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
				mono: ['SF Mono', 'Menlo', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				chess: {
					'light-square': '#f0d9b5',
					'dark-square': '#b58863',
					'highlight': 'rgba(255, 255, 0, 0.5)',
					'last-move': 'rgba(0, 128, 128, 0.5)',
					'possible-move': 'rgba(0, 0, 0, 0.2)'
				},
				monopoly: {
					brown: '#6B4423',
					lightBlue: '#7EB6D9',
					pink: '#B957A8',
					orange: '#E67E22',
					red: '#C0392B',
					yellow: '#D4AC0D',
					green: '#1E8449',
					darkBlue: '#1B4F72',
					railroad: '#4B5563',
					utility: '#6B7280',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				slideDown: {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out',
				'fade-out': 'fadeOut 0.5s ease-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'spin-slow': 'spin 3s linear infinite',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(20px)'
			},
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
			},
			transitionTimingFunction: {
				'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
			},
			transitionDuration: {
				'400': '400ms',
				'600': '600ms',
			},
            snake: {
                body: '#8B5CF6',
                head: '#D946EF',
                food: '#F97316'
            },
            game: {
                background: '#1A1F2C',
                grid: '#2A2F3C'
            },
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
	safelist: [
		{
			pattern: /(col|row)-(start|span)-[1-9]|10|11/,
		},
	],
} satisfies Config;
