import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', '"Plus Jakarta Sans"', 'Figtree', ...defaultTheme.fontFamily.sans],
                display: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                cream: {
                    50: '#FDFBF7',
                    100: '#FAF7F2',
                    200: '#F4EFE6',
                    300: '#E8DFD1',
                    400: '#D5C5B0',
                },
                terracotta: {
                    50: '#FDF5F2',
                    100: '#FCE7E1',
                    200: '#F8C8BD',
                    300: '#F3A492',
                    400: '#EB866F',
                    500: '#D4694E',
                    600: '#BB5438',
                    700: '#A04530',
                    800: '#853928',
                    900: '#6E3122',
                },
                sage: {
                    50: '#F5F8F6',
                    100: '#E5EFEA',
                    200: '#CCDED5',
                    300: '#AECBBF',
                    400: '#8AB59F',
                    500: '#6FA38A',
                    600: '#578770',
                    700: '#476B5B',
                    800: '#3B584A',
                    900: '#32493E',
                },
                charcoal: {
                    50: '#F7F7F7',
                    100: '#EBEBEB',
                    200: '#D6D6D6',
                    300: '#B3B3B3',
                    400: '#8A8A8A',
                    500: '#6B6B6B',
                    600: '#545454',
                    700: '#434343',
                    800: '#2E2E2E',
                    900: '#1C1C1C',
                    950: '#111111',
                },
            },
            boxShadow: {
                'soft-xs': '0 1px 3px -1px rgba(30, 30, 30, 0.04), 0 1px 2px -1px rgba(30, 30, 30, 0.02)',
                'soft-sm': '0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 4px -1px rgba(30, 30, 30, 0.03)',
                'soft-md': '0 8px 24px -6px rgba(30, 30, 30, 0.08), 0 4px 10px -3px rgba(30, 30, 30, 0.03)',
                'soft-lg': '0 16px 40px -8px rgba(30, 30, 30, 0.10), 0 8px 16px -4px rgba(30, 30, 30, 0.04)',
                'soft-xl': '0 24px 48px -12px rgba(30, 30, 30, 0.12), 0 12px 24px -6px rgba(30, 30, 30, 0.05)',
                'terracotta-glow': '0 8px 24px -6px rgba(212, 105, 78, 0.28)',
                'sage-glow': '0 8px 24px -6px rgba(111, 163, 138, 0.28)',
                'inner-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },

    plugins: [forms],
};
