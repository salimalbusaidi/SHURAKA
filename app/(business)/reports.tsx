// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { StatCard } from '@/components/ui/StatCard';
import { UpsellModal } from '@/components/layout/UpsellModal';
import { useAlert } from '@/template';

export default function ReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { business, customers, transactions, currentPlan } = useBusiness();
  const { showAlert } = useAlert();
  const [upsell, setUpsell] = useState(false);
  const [period, setPeriod] = useState('month');

  const retentionRate = Math.round((customers.filter(c => c.total_visits > 3).length / customers.length) * 100);
  const topDays = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
  const dayVisits = [12, 18, 15, 22, 30, 28, 8];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRight}>
          <Pressable onPress={() => currentPlan === 'plus' ? showAlert('', 'تصدير CSV') : setUpsell(true)} style={styles.exportBtn}>
            <MaterialIcons name="download" size={18} color={Colors.white} />
            <Text style={styles.exportText}>تصدير</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>التقارير</Text>
        <Pressable onPress={() => router.back()}><MaterialIcons name="arrow-forward" size={24} color={Colors.white} /></Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {[{ id: 'week', label: 'أسبوع' }, { id: 'month', label: 'شهر' }, { id: 'year', label: 'سنة' }].map(p => (
            <Pressable key={p.id} style={[styles.periodBtn, period === p.id && styles.periodBtnActive]} onPress={() => setPeriod(p.id)}>
              <Text style={[styles.periodBtnText, period === p.id && styles.periodBtnTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* KPIs */}
        <Text style={styles.sectionTitle}>مؤشرات الأداء</Text>
        <View style={styles.kpiGrid}>
          <StatCard title="إجمالي العملاء" value={business?.total_customers || 0} icon="people" iconColor={Colors.primary} iconBg="#EEF2FF" trend="+12%" trendUp />
          <StatCard title="معدل العودة" value={`${retentionRate}%`} icon="repeat" iconColor={Colors.success} iconBg={Colors.successLight} trend="+3%" trendUp />
        </View>
        <View style={styles.kpiGrid}>
          <StatCard title="مكافآت مستبدلة" value={business?.total_rewards || 0} icon="card-giftcard" iconColor={Colors.gold} iconBg="#FEF3C7" />
          <StatCard title="نقاط صادرة" value={(business?.total_points || 0).toLocaleString('ar')} icon="star" iconColor="#8B5CF6" iconBg="#F3E8FF" />
        </View>

        {/* Weekly Visits Chart */}
        <Text style={styles.sectionTitle}>الزيارات حسب اليوم</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {topDays.map((day, i) => (
              <View key={i} style={styles.barWrap}>
                <Text style={styles.barValue}>{dayVisits[i]}</Text>
                <View style={[styles.bar, { height: (dayVisits[i] / 30) * 80, backgroundColor: dayVisits[i] === Math.max(...dayVisits) ? Colors.gold : Colors.primary + '80' }]} />
                <Text style={styles.barLabel}>{day.slice(0, 2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top customers */}
        <Text style={styles.sectionTitle}>أكثر العملاء تفاعلًا</Text>
        {customers.sort((a, b) => b.points - a.points).slice(0, 5).map((c, i) => (
          <View key={c.id} style={styles.rankRow}>
            <View style={styles.rankPoints}><Text style={styles.rankPointsText}>{c.points} نقطة</Text></View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{c.name}</Text>
              <Text style={styles.rankVisits}>{c.total_visits} زيارة</Text>
            </View>
            <View style={[styles.rankNum, { backgroundColor: i < 3 ? Colors.gold : Colors.gray200 }]}>
              <Text style={[styles.rankNumText, { color: i < 3 ? Colors.white : Colors.gray600 }]}>#{i + 1}</Text>
            </View>
          </View>
        ))}

        {/* Inactive */}
        <Text style={styles.sectionTitle}>العملاء غير النشطين</Text>
        {customers.filter(c => c.status === 'inactive').map(c => (
          <View key={c.id} style={styles.inactiveRow}>
            <Pressable style={styles.inactiveAction} onPress={() => showAlert('', `إرسال عرض استعادة لـ${c.name}`)}>
              <MaterialIcons name="send" size={16} color={Colors.primary} />
              <Text style={styles.inactiveActionText}>استعادة</Text>
            </Pressable>
            <View>
              <Text style={styles.inactiveName}>{c.name}</Text>
              <Text style={styles.inactiveVisit}>آخر زيارة: {c.last_visit}</Text>
            </View>
            <View style={styles.inactiveAvatar}>
              <Text style={styles.inactiveAvatarText}>{c.name.charAt(0)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <UpsellModal visible={upsell} onClose={() => setUpsell(false)} feature="تصدير البيانات" requiredPlan="شركاء بلس" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  headerRight: { flexDirection: 'row' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.md },
  exportText: { color: Colors.white, fontSize: 13, ...Fonts.semiBold },
  periodSelector: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.md, ...Shadows.small },
  periodBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
  periodBtnActive: { backgroundColor: Colors.primary },
  periodBtnText: { fontSize: 14, color: Colors.textSecondary, ...Fonts.medium },
  periodBtnTextActive: { color: Colors.white, ...Fonts.bold },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 10 },
  kpiGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  chartCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.small, marginBottom: Spacing.md },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6 },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  barValue: { fontSize: 10, color: Colors.textSecondary },
  bar: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: 10, color: Colors.textSecondary },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  rankNum: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankNumText: { fontSize: 13, ...Fonts.bold },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 15, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  rankVisits: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  rankPoints: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  rankPointsText: { fontSize: 12, color: Colors.white, ...Fonts.semiBold },
  inactiveRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  inactiveAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.gray200, alignItems: 'center', justifyContent: 'center' },
  inactiveAvatarText: { fontSize: 18, ...Fonts.bold, color: Colors.gray500 },
  inactiveName: { fontSize: 15, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  inactiveVisit: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  inactiveAction: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.primary },
  inactiveActionText: { fontSize: 12, color: Colors.primary, ...Fonts.semiBold },
});
