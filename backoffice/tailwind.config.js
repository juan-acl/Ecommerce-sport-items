/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta basada en el frontend (Deep Oceanic Blue) adaptada a un panel sobrio.
        // Surfaces — neutros fríos
        surface: '#f6f8fa',
        'surface-bright': '#f6f8fa',
        'surface-dim': '#e6e9ee',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f8fa',
        'surface-container': '#eef1f5',
        'surface-container-high': '#e6e9ee',
        'surface-container-highest': '#dde2e8',
        'surface-variant': '#e6e9ee',
        'on-surface': '#111c2d',
        'on-surface-variant': '#5b636a',
        'inverse-surface': '#111c2d',
        'inverse-on-surface': '#f7f8fa',
        'surface-tint': '#006b58',

        // Outline
        outline: '#8a9197',
        'outline-variant': '#e4e8ed',

        // Primary — Deep Oceanic Blue
        primary: '#006b58',
        'primary-dark': '#005142',
        'on-primary': '#ffffff',
        'primary-container': '#ddfbf2',
        'on-primary-container': '#005142',
        'inverse-primary': '#54dcbc',
        'primary-fixed': '#74f9d7',
        'primary-fixed-dim': '#54dcbc',
        'on-primary-fixed': '#002019',
        'on-primary-fixed-variant': '#005142',

        // Secondary — Verdant Teal (positivo / ingresos)
        secondary: '#0e8a94',
        'on-secondary': '#ffffff',
        'secondary-container': '#e0f7f8',
        'on-secondary-container': '#0b5f67',
        'secondary-fixed': '#74f9d7',
        'secondary-fixed-dim': '#54dcbc',
        'on-secondary-fixed': '#002019',
        'on-secondary-fixed-variant': '#005142',

        // Acentos cian / menta del login del frontend
        sky: '#bdf1f4',
        mint: '#74f9d7',
        'mint-dim': '#54dcbc',

        // Tertiary — neutro
        tertiary: '#45484a',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#f3f5f8',
        'on-tertiary-container': '#2e3233',
        'tertiary-fixed': '#e0e3e5',
        'tertiary-fixed-dim': '#c4c7c9',
        'on-tertiary-fixed': '#191c1e',
        'on-tertiary-fixed-variant': '#444749',

        // Error
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#fdf1f0',
        'on-error-container': '#93000a',

        // Background
        background: '#f6f8fa',
        'on-background': '#111c2d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label-md': ['11px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.02em' }],
        'body-md': ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'body-lg': ['15px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-sm': ['18px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'headline-md': ['22px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['28px', { lineHeight: '36px', letterSpacing: '-0.025em', fontWeight: '700' }],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.625rem',
        '2xl': '0.75rem',
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
        card: '0 1px 2px rgba(17, 28, 45, 0.04)',
        cta: 'none',
        'primary-glow': 'none',
        dropdown: '0 8px 24px -6px rgba(17, 28, 45, 0.14)',
        modal: '0 24px 48px -12px rgba(17, 28, 45, 0.25)',
        soft: '0 1px 2px rgba(17, 28, 45, 0.04), 0 4px 16px -8px rgba(17, 28, 45, 0.08)',
      },
    },
  },
  plugins: [],
};
