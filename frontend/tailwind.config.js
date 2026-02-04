/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    300: '#EAD48F',
                    400: '#DFC066',
                    500: '#D4AF37',
                    600: '#AA8C2C',
                },
                /* Light Mode (Commented out)
                primary: "#ffffff",
                secondary: "#f9f9f9",
                dark: "#0a0a0a",
                */
                // Dark Mode
                primary: "#0a0a0a",
                secondary: "#141414",
                dark: "#ffffff",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}
