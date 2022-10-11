const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './node_modules/flotiq-components-react/dist/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Inter', ...defaultTheme.fontFamily.sans],
        },
        extend: {
            colors: {
                'blue-dark': '#141046',
                blue: '#3B3953',
            },
        },
    },
    plugins: [],
};
