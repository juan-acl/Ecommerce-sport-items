/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surface
        surface: '#f9f9ff',
        'surface-bright': '#f9f9ff',
        'surface-dim': '#cfdaf2',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f3ff',
        'surface-container': '#e7eeff',
        'surface-container-high': '#dee8ff',
        'surface-container-highest': '#d8e3fb',
        'surface-variant': '#d8e3fb',
        'on-surface': '#111c2d',
        'on-surface-variant': '#41484d',
        'inverse-surface': '#263143',
        'inverse-on-surface': '#ecf1ff',
        'surface-tint': '#2c6480',

        // Outline
        outline: '#71787d',
        'outline-variant': '#c0c7cd',

        // Primary (Deep Oceanic Blue)
        primary: '#00354a',
        'on-primary': '#ffffff',
        'primary-container': '#0a4d68',
        'on-primary-container': '#88bddc',
        'inverse-primary': '#98cded',
        'primary-fixed': '#c3e8ff',
        'primary-fixed-dim': '#98cded',
        'on-primary-fixed': '#001e2c',
        'on-primary-fixed-variant': '#084c67',

        // Secondary (Verdant Teal)
        secondary: '#006b58',
        'on-secondary': '#ffffff',
        'secondary-container': '#74f9d7',
        'on-secondary-container': '#00725e',
        'secondary-fixed': '#74f9d7',
        'secondary-fixed-dim': '#54dcbc',
        'on-secondary-fixed': '#002019',
        'on-secondary-fixed-variant': '#005142',

        // Tertiary
        tertiary: '#2e3233',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#45484a',
        'on-tertiary-container': '#b4b7b9',
        'tertiary-fixed': '#e0e3e5',
        'tertiary-fixed-dim': '#c4c7c9',
        'on-tertiary-fixed': '#191c1e',
        'on-tertiary-fixed-variant': '#444749',

        // Error
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Background
        background: '#f9f9ff',
        'on-background': '#111c2d',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-md': [
          '24px',
          { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'headline-lg': [
          '30px',
          { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        margin: '1.25rem',
        gutter: '1rem',
        'unit-xs': '0.25rem',
        'unit-sm': '0.5rem',
        'unit-md': '1rem',
        'unit-lg': '1.5rem',
        'unit-xl': '2rem',
      },
      boxShadow: {
        // Elevation Level 1 (subtle, for cards)
        card: '0 4px 12px rgba(17, 28, 45, 0.04)',
        // Elevation Level 2 (floating, for CTAs)
        cta: '0 8px 24px rgba(0, 53, 74, 0.20)',
        'primary-glow': '0 8px 24px rgba(0, 53, 74, 0.20)',
      },
    },
  },
  plugins: [],
};
