/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces — clean zinc/slate scale
        surface: '#fafafa',
        'surface-bright': '#fafafa',
        'surface-dim': '#e4e4e7',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f4f4f5',
        'surface-container': '#f4f4f5',
        'surface-container-high': '#e4e4e7',
        'surface-container-highest': '#d4d4d8',
        'surface-variant': '#e4e4e7',
        'on-surface': '#09090b',          // zinc-950
        'on-surface-variant': '#71717a',  // zinc-500
        'inverse-surface': '#18181b',     // zinc-900
        'inverse-on-surface': '#fafafa',
        'surface-tint': '#6366f1',

        // Outline
        outline: '#a1a1aa',               // zinc-400
        'outline-variant': '#e4e4e7',     // zinc-200

        // Primary — Indigo
        primary: '#4f46e5',               // indigo-600
        'on-primary': '#ffffff',
        'primary-container': '#eef2ff',   // indigo-50
        'on-primary-container': '#4338ca',
        'inverse-primary': '#a5b4fc',
        'primary-fixed': '#e0e7ff',
        'primary-fixed-dim': '#c7d2fe',
        'on-primary-fixed': '#312e81',
        'on-primary-fixed-variant': '#4338ca',

        // Secondary — Emerald (positive / revenue)
        secondary: '#059669',             // emerald-600
        'on-secondary': '#ffffff',
        'secondary-container': '#ecfdf5', // emerald-50
        'on-secondary-container': '#047857',
        'secondary-fixed': '#d1fae5',
        'secondary-fixed-dim': '#a7f3d0',
        'on-secondary-fixed': '#064e3b',
        'on-secondary-fixed-variant': '#065f46',

        // Tertiary — neutral zinc
        tertiary: '#52525b',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#f4f4f5',
        'on-tertiary-container': '#3f3f46',
        'tertiary-fixed': '#e4e4e7',
        'tertiary-fixed-dim': '#d4d4d8',
        'on-tertiary-fixed': '#09090b',
        'on-tertiary-fixed-variant': '#52525b',

        // Error
        error: '#dc2626',                 // red-600
        'on-error': '#ffffff',
        'error-container': '#fef2f2',     // red-50
        'on-error-container': '#991b1b',  // red-800

        // Background
        background: '#fafafa',
        'on-background': '#09090b',
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
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
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
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        cta: '0 4px 14px rgba(79,70,229,0.25)',
        'primary-glow': '0 4px 14px rgba(79,70,229,0.25)',
        dropdown: '0 4px 16px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};
