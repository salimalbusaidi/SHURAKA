// Powered by OnSpace.AI
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const typeConfig: Record<string, any> = {
    stamp: { icon: 'local-cafe', color: Colors.primary, bg: '#EEF2FF', label: 'طابع' },
    points: { icon: 'star', color: Colors.gold, bg: '#FEF3C7', label: 'نقاط' },
    reward: { icon: 'card-giftcard', color: Colors.success, bg: Colors.successLight, label: 'مكافأة' },
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>سجل العمليات</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }}>
        {MOCK_TRANSACTIONS.map((tx, i) => {
          const cfg = typeConfig[tx.type] || typeConfig.stamp;
          return (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txRight}>
                <Text style={[styles.txValue, { color: cfg.color }]}>{tx.value}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txCustomer}>{tx.customer_name}</Text>
                <Text style={styles.txEmployee}>{tx.employee} · {tx.branch}</Text>
              </View>
              <View style={[styles.txIcon, { backgroundColor: cfg.bg }]}>
                <MaterialIcons name={cfg.icon} size={22} color={cfg.color} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold, textAlign: 'right' },
  txCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  txIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txCustomer: { fontSize: 15, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  txEmployee: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right', marginTop: 2 },
  txRight: { alignItems: 'flex-start' },
  txValue: { fontSize: 15, ...Fonts.bold },
  txTime: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
});
