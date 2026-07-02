// Powered by OnSpace.AI - Employees Screen
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { Badge } from '@/components/ui/Badge';
import { useAlert } from '@/template';

const permLabels: Record<string, string> = {
  scan: 'مسح QR',
  add_points: 'إضافة نقاط',
  redeem: 'استبدال مكافآت',
  view_customers: 'مشاهدة العملاء',
  manage_offers: 'إدارة العروض',
};

export default function EmployeesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { employees } = useBusiness();
  const { showAlert } = useAlert();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>الموظفون</Text>
        <Pressable style={styles.addBtn} onPress={() => showAlert('قريبًا', 'إضافة موظف جديد')}>
          <MaterialIcons name="person-add" size={20} color={Colors.white} />
        </Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {employees.map(emp => (
          <View key={emp.id} style={styles.employeeCard}>
            <View style={styles.empHeader}>
              <View style={styles.empActions}>
                <Pressable style={styles.empActionBtn} onPress={() => showAlert('', `تعطيل ${emp.name}`)}>
                  <MaterialIcons name="block" size={18} color={Colors.error} />
                </Pressable>
                <Pressable style={styles.empActionBtn} onPress={() => showAlert('', `تعديل ${emp.name}`)}>
                  <MaterialIcons name="edit" size={18} color={Colors.primary} />
                </Pressable>
              </View>
              <View style={styles.empInfo}>
                <View style={styles.empAvatar}>
                  <Text style={styles.empAvatarText}>{emp.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.empName}>{emp.name}</Text>
                  <Text style={styles.empRole}>{emp.role} · {emp.branch}</Text>
                  <Badge label={emp.status === 'active' ? 'نشط' : 'موقوف'} variant={emp.status === 'active' ? 'success' : 'error'} size="sm" />
                </View>
              </View>
            </View>
            <View style={styles.empStats}>
              <View style={styles.empStat}>
                <MaterialIcons name="touch-app" size={16} color={Colors.primary} />
                <Text style={styles.empStatText}>{emp.operations_today} عملية اليوم</Text>
              </View>
              <View style={styles.empStat}>
                <MaterialIcons name="phone" size={16} color={Colors.textSecondary} />
                <Text style={styles.empStatText}>{emp.phone}</Text>
              </View>
            </View>
            <View style={styles.permsArea}>
              <Text style={styles.permsTitle}>الصلاحيات:</Text>
              <View style={styles.permsList}>
                {emp.permissions.map(p => (
                  <View key={p} style={styles.permBadge}>
                    <MaterialIcons name="check-circle" size={12} color={Colors.success} />
                    <Text style={styles.permText}>{permLabels[p] || p}</Text>
                  </View>
                ))}
              </View>
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
  backBtn: { padding: 4 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  employeeCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.small },
  empHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  empActions: { flexDirection: 'row', gap: 8 },
  empActionBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  empInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  empAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  empAvatarText: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  empName: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 2 },
  empRole: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', marginBottom: 6 },
  empStats: { flexDirection: 'row', gap: 16, justifyContent: 'flex-end', backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, padding: 10, marginBottom: 10 },
  empStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  empStatText: { fontSize: 13, color: Colors.textSecondary },
  permsArea: { alignItems: 'flex-end' },
  permsTitle: { fontSize: 13, ...Fonts.semiBold, color: Colors.text, marginBottom: 8 },
  permsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' },
  permBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.successLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  permText: { fontSize: 12, color: Colors.success, ...Fonts.medium },
});
