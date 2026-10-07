const { colors } = require('./src/lib/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // PlantQuest is light-only; 'class' stops NativeWind on web from fighting the browser's dark mode setting.
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: colors.cream,
        sand: { DEFAULT: colors.sand, dark: colors.sandDark, deep: colors.sandDeep },
        ink: colors.ink,
        muted: colors.muted,
        faint: colors.faint,
        leaf: { DEFAULT: colors.leaf, dark: colors.leafDark, light: colors.leafLight, pale: colors.leafPale },
        sky: { DEFAULT: colors.sky, dark: colors.skyDark, pale: colors.skyPale },
        sun: { DEFAULT: colors.sun, dark: colors.sunDark, pale: colors.sunPale },
        coral: { DEFAULT: colors.coral, dark: colors.coralDark, light: colors.coralLight, pale: colors.coralPale },
        grape: { DEFAULT: colors.grape, dark: colors.grapeDark, pale: colors.grapePale },
        pink: { DEFAULT: colors.pink, dark: colors.pinkDark, pale: colors.pinkPale },
        teal: { DEFAULT: colors.teal, dark: colors.tealDark, pale: colors.tealPale },
      },
      fontFamily: {
        // Fredoka ships separate files per weight, so each weight is its own family (fontWeight alone won't switch files on Android).
        body: ['Fredoka_400Regular'],
        medium: ['Fredoka_500Medium'],
        semibold: ['Fredoka_600SemiBold'],
        heading: ['Fredoka_700Bold'],
      },
    },
  },
  plugins: [],
};
