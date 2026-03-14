export const colors = {
  primary: '#9c7ce6',
  primaryLight: '#d4c5f9',
  primaryDark: '#7b5cc5',
  accent: {
    blue: '#5c9ce6',
    green: '#66bb6a',
    coral: '#ef8e73',
    purple: '#9c7ce6',
    yellow: '#f5c842',
    red: '#ef5350',
  },
  pastel: {
    lavender: '#d4c5f9',
    lavenderLight: '#ede7fb',
    sage: '#c8e6c9',
    sageLight: '#e8f5e9',
    yellow: '#fff9c4',
    yellowLight: '#fffde7',
    peach: '#ffcdd2',
    peachLight: '#fce4ec',
    blue: '#bbdefb',
    blueLight: '#e3f2fd',
  },
  bg: '#faf7f2',
  bgCard: '#ffffff',
  cream: {
    50: '#faf7f2',
    100: '#f5f0e8',
    200: '#ede5d8',
    300: '#e0d4c4',
  },
  border: '#ede5d8',
  text: {
    primary: '#1a1a2e',
    secondary: '#5a5a72',
    muted: '#9e9eb0',
  },
  white: '#ffffff',
  danger: '#ef5350',
  success: '#66bb6a',
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
  lg: 28,
  xl: 32,
  full: 9999,
};

export const fonts = {
  regular: { fontSize: 15, color: colors.text.primary },
  small: { fontSize: 13, color: colors.text.secondary },
  muted: { fontSize: 12, color: colors.text.muted },
  heading: { fontSize: 26, fontWeight: '800' as const, color: colors.text.primary },
  subheading: { fontSize: 18, fontWeight: '700' as const, color: colors.text.primary },
  label: { fontSize: 13, fontWeight: '500' as const, color: colors.text.secondary },
  caption: { fontSize: 10, fontWeight: '600' as const, color: colors.text.muted },
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
};
