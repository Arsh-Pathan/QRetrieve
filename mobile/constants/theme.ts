export const colors = {
  primary: '#f0a08a',
  primaryLight: '#f5c4b5',
  primaryDark: '#d87a60',
  accent: {
    blue: '#7eb8da',
    green: '#8ecfa0',
    coral: '#f0a08a',
    purple: '#b8a0d8',
    yellow: '#f0d88a',
  },
  bg: '#fdf8f0',
  bgCard: '#ffffff',
  border: '#f3e1c1',
  text: {
    primary: '#2d2417',
    secondary: '#6b5e50',
    muted: '#9e9488',
  },
  white: '#ffffff',
  danger: '#e74c3c',
  success: '#8ecfa0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 12,
  md: 20,
  lg: 30,
  full: 9999,
};

export const fonts = {
  regular: { fontSize: 15, color: colors.text.primary },
  small: { fontSize: 13, color: colors.text.secondary },
  muted: { fontSize: 12, color: colors.text.muted },
  heading: { fontSize: 24, fontWeight: '700' as const, color: colors.text.primary },
  subheading: { fontSize: 17, fontWeight: '600' as const, color: colors.text.primary },
  label: { fontSize: 13, fontWeight: '500' as const, color: colors.text.secondary },
};
