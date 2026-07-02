// Powered by OnSpace.AI - شركاء Theme
import { I18nManager } from 'react-native';

// Force RTL
I18nManager.forceRTL(true);

export const Colors = {
  primary: '#0D1F3C',       // Dark Navy Blue
  primaryLight: '#1A3461',
  primaryDark: '#060F1E',
  gold: '#C9A84C',
  goldLight: '#E8C96A',
  goldDark: '#A07830',
  white: '#FFFFFF',
  offWhite: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceDark: '#0F2347',
  border: '#E2E8F0',
  borderDark: '#1E3A6E',
  text: '#0D1F3C',
  textSecondary: '#6B7A99',
  textLight: '#9AA5BE',
  textWhite: '#FFFFFF',
  textGold: '#C9A84C',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  overlay: 'rgba(13, 31, 60, 0.6)',
  overlayLight: 'rgba(13, 31, 60, 0.3)',
  cardBg: '#FFFFFF',
  gradientStart: '#0D1F3C',
  gradientEnd: '#1A3461',
  gradientGold: '#C9A84C',
  gradientGoldEnd: '#E8C96A',

  // Plan colors
  planStarter: '#6366F1',
  planGrowth: '#10B981',
  planPlus: '#C9A84C',

  tabBar: '#0D1F3C',
  tabBarBorder: '#1A3461',
  tabActive: '#C9A84C',
  tabInactive: '#6B7A99',
};

export const Fonts = {
  regular: { fontFamily: 'System', fontWeight: '400' as const },
  medium: { fontFamily: 'System', fontWeight: '500' as const },
  semiBold: { fontFamily: 'System', fontWeight: '600' as const },
  bold: { fontFamily: 'System', fontWeight: '700' as const },
  extraBold: { fontFamily: 'System', fontWeight: '800' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
};

export const Shadows = {
  small: {
    shadowColor: '#0D1F3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0D1F3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#0D1F3C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export default { Colors, Fonts, Spacing, BorderRadius, Shadows };
