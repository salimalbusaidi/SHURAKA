// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Fonts } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gold' | 'default';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  const variantColors = {
    success: { bg: Colors.successLight, text: Colors.success },
    warning: { bg: Colors.warningLight, text: Colors.warning },
    error: { bg: Colors.errorLight, text: Colors.error },
    info: { bg: Colors.infoLight, text: Colors.info },
    gold: { bg: '#FEF3C7', text: Colors.gold },
    default: { bg: Colors.gray100, text: Colors.gray600 },
  };
  const c = variantColors[variant];
  return (
    <View style={[styles.base, styles[`size_${size}`], { backgroundColor: c.bg }]}>
      <Text style={[styles.text, styles[`textSize_${size}`], { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: BorderRadius.full, alignSelf: 'flex-start' },
  size_sm: { paddingHorizontal: 8, paddingVertical: 2 },
  size_md: { paddingHorizontal: 12, paddingVertical: 4 },
  text: { ...Fonts.semiBold },
  textSize_sm: { fontSize: 10 },
  textSize_md: { fontSize: 12 },
});
