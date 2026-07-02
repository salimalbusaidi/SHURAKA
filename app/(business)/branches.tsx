// Powered by OnSpace.AI
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { useAlert } from '@/template';

export default function BranchesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { branches } = useBusiness();
  const { showAlert } = useAlert();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()}><MaterialIcons name="arrow-forward" size={24} color={Colors.white} /></Pressable>
        <Text style={styles.headerTitle}>الفروع ({branches.length})</Text>
        <Pressable style={styles.addBtn} onPress={() => showAlert('قريبًا', 'إضافة فرع جديد')}>
          <MaterialIcons name="add" size={22} color={Colors.white} />
        </Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }}>
        {branches.map(br => (
          <View key={br.id} style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <View style={[styles.statusDot, { backgroundColor: br.status === 'open' ? Colors.success : Colors.error }]} />
              <Text style={styles.statusText}>{br.status === 'open' ? 'مفتوح' : 'مغلق'}</Text>
            </View>
            <View style={styles.branchMain}>
              <View style={[styles.branchIcon, { backgroundColor: br.status === 'open' ? Colors.successLight : Colors.errorLight }]}>
                <MaterialIcons name="store" size={28} color={br.status === 'open' ? Colors.success : Colors.error} />
              </View>
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>{br.name}</Text>
                <Text style={styles.branchAddress}>{br.address}</Text>
                <Text style={styles.branchPhone}>{br.phone}</Text>
              </View>
            </View>
            <View style={styles.branchStats}>
              <View style={styles.branchStat}>
                <MaterialIcons name="people" size={16} color={Colors.primary} />
                <Text style={styles.branchStatText}>{br.employees} موظف</Text>
              </View>
              <View style={styles.branchStat}>
                <MaterialIcons name="directions-walk" size={16} color={Colors.success} />
                <Text style={styles.branchStatText}>{br.customers_today} زيارة اليوم</Text>
              </View>
            </View>
            <View style={styles.branchActions}>
              <Pressable style={styles.branchActionBtn} onPress={() => showAlert('', `عرض إحصائيات ${br.name}`)}>
                <MaterialIcons name="bar-chart" size={16} color={Colors.primary} />
                <Text style={styles.branchActionText}>إحصائيات</Text>
              </Pressable>
              <Pressable style={styles.branchActionBtn} onPress={() => showAlert('', `تعديل ${br.name}`)}>
                <MaterialIcons name="edit" size={16} color={Colors.primary} />
                <Text style={styles.branchActionText}>تعديل</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  branchCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.small },
  branchHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, color: Colors.textSecondary, ...Fonts.medium },
  branchMain: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  branchIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  branchInfo: { flex: 1 },
  branchName: { fontSize: 18, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  branchAddress: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  branchPhone: { fontSize: 13, color: Colors.primary, textAlign: 'right' },
  branchStats: { flexDirection: 'row', gap: 16, justifyContent: 'flex-end', backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, padding: 10, marginBottom: 10 },
  branchStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  branchStatText: { fontSize: 13, color: Colors.textSecondary },
  branchActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  branchActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border },
  branchActionText: { fontSize: 13, color: Colors.primary, ...Fonts.medium },
});
