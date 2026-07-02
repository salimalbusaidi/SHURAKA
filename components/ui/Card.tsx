// Powered by OnSpace.AI
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, style, variant = 'default', padding = 'md' }: CardProps) {
  return (
    <View style={[
      styles.base,
      styles[variant],
      styles[`padding_${padding}`],
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: BorderRadius.lg },
  default: { backgroundColor: Colors.white, ...Shadows.small },
  elevated: { backgroundColor: Colors.white, ...Shadows.large },
  outlined: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  dark: { backgroundColor: Colors.primary },
  padding_none: { padding: 0 },
  padding_sm: { padding: Spacing.sm },
  padding_md: { padding: Spacing.md },
  padding_lg: { padding: Spacing.lg },
});
