// Powered by OnSpace.AI - Responsive breakpoint hook
import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isDesktop: boolean;  // >= 1024
  isTablet: boolean;   // 600 – 1023
  isMobile: boolean;   // < 600
  isWeb: boolean;
  sidebarWidth: number;
  contentPadding: number;
}

export function useResponsive(): ResponsiveInfo {
  const [dims, setDims] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setDims(window));
    return () => sub?.remove();
  }, []);

  const { width, height } = dims;
  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 1024;
  const isTablet = width >= 600 && width < 1024;
  const isMobile = width < 600;

  return {
    width,
    height,
    isDesktop,
    isTablet,
    isMobile,
    isWeb,
    sidebarWidth: isDesktop ? 240 : isTablet ? 72 : 0,
    contentPadding: isDesktop ? 32 : isTablet ? 20 : 16,
  };
}
