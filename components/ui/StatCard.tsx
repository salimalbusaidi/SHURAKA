// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows, Fonts, Spacing } from '@/constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}

export function StatCard({ title, value, icon, iconColor = Colors.primary, iconBg = Colors.gray100, trend, trendUp, subtitle }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon as any} size={22} color={iconColor} />
        </View>
        {trend ? (
          <View style={[styles.trend, { backgroundColor: trendUp ? Colors.successLight : Colors.errorLight }]}>
            <MaterialIcons name={trendUp ? 'trending-up' : 'trending-down'} size={14} color={trendUp ? Colors.success : Colors.error} />
            <Text style={[styles.trendText, { color: trendUp ? Colors.success : Colors.error }]}>{trend}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
    minWidth: 140,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  iconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 26, ...Fonts.extraBold, color: Colors.text, marginBottom: 2 },
  title: { fontSize: 12, color: Colors.textSecondary, ...Fonts.medium },
  subtitle: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  trend: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full, gap: 2 },
  trendText: { fontSize: 11, ...Fonts.semiBold },
});
