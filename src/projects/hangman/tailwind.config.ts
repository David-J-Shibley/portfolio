import type { Config } from 'tailwindcss'

const config: Config = {
content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
],
theme: {
    extend: {
    colors: {
        hangman: {
        primary: "#3b82f6", // A nice blue for primary UI elements
        secondary: "#8b5cf6", // Purple for accents
        background: "#f9fafb", // Light background for the app
        correct: "#10b981", // Green for correct letter guesses
        incorrect: "#ef4444", // Red for incorrect guesses
        hint: "#f59e0b", // Amber for hints
        neutral: "#6b7280", // Gray for unguessed letters
        scaffold: "#78350f", // Brown for the hangman scaffold
        win: "#047857", // Dark green for win state
        lose: "#b91c1c", // Dark red for lose state
        keyboard: {
            bg: "#e5e7eb", // Light gray for keyboard keys
            text: "#1f2937", // Dark text on keys
            used: "#9ca3af", // Gray for used keys
        }
        }
    },
    animation: {
        'bounce-slow': 'bounce 1.5s infinite',
    }
    },
},
plugins: [],
}

export default config

