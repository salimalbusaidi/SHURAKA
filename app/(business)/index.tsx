// Powered by OnSpace.AI - Business Dashboard (Web-optimized)
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useResponsive } from '@/hooks/useResponsive';
import { StatCard } from '@/components/ui/StatCard';
import { TopBar } from '@/components/layout/TopBar';
import WebTopBar from '@/components/layout/WebTopBar';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { business, transactions, customers } = useBusiness();
  const { isDesktop, isTablet, contentPadding } = useResponsive();
  const isWeb = Platform.OS === 'web' && (isDesktop || isTablet);

  const quickActions = [
    { icon: 'qr-code-scanner', label: 'مسح QR', color: Colors.primary, bg: '#EEF2FF', route: '/(business)/scanner' },
    { icon: 'person-add', label: 'عميل جديد', color: Colors.success, bg: Colors.successLight, route: '/(business)/customers' },
    { icon: 'campaign', label: 'إشعار', color: Colors.warning, bg: Colors.warningLight, route: '/(business)/offers' },
    { icon: 'bar-chart', label: 'تقارير', color: Colors.info, bg: Colors.infoLight, route: '/(business)/reports' },
    { icon: 'card-giftcard', label: 'الولاء', color: '#8B5CF6', bg: '#F3E8FF', route: '/(business)/loyalty' },
    { icon: 'credit-card', label: 'الاشتراك', color: Colors.gold, bg: '#FEF3C7', route: '/(business)/subscription' },
  ];

  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const todayVisits = transactions.filter(t => t.time.includes('اليوم')).length;

  return (
    <View style={styles.container}>
      {isWeb ? <WebTopBar title="الرئيسية" /> : <TopBar />}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ padding: contentPadding, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Banner */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={[styles.greetingBanner, isWeb && styles.greetingBannerWeb]}
        >
          <View style={styles.greetingContent}>
            <Text style={styles.greetingName}>مرحبًا، {user?.name?.split(' ')[0]} 👋</Text>
            <Text style={styles.greetingBusiness}>{business?.business_name}</Text>
            <Text style={styles.greetingDate}>الخميس، ٢ يوليو ٢٠٢٦</Text>
          </View>
          <View style={styles.greetingBadge}>
            <MaterialIcons name="store" size={36} color={Colors.gold} />
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={[styles.quickActions, isWeb && styles.quickActionsWeb]}>
          {quickActions.map((a, i) => (
            <Pressable key={i} style={[styles.quickAction, isWeb && styles.quickActionWeb]} onPress={() => router.push(a.route as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: a.bg }]}>
                <MaterialIcons name={a.icon as any} size={26} color={a.color} />
              </View>
              <Text style={styles.quickActionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>الإحصائيات</Text>
        <View style={[styles.statsGrid, isWeb && styles.statsGridWeb]}>
          <StatCard title="إجمالي العملاء" value={business?.total_customers || 0} icon="people" iconColor={Colors.primary} iconBg="#EEF2FF" trend="+12%" trendUp />
          <StatCard title="عملاء نشطون" value={activeCustomers} icon="person" iconColor={Colors.success} iconBg={Colors.successLight} trend="+5%" trendUp />
          <StatCard title="نقاط ممنوحة" value={(business?.total_points || 0).toLocaleString('ar')} icon="star" iconColor={Colors.gold} iconBg="#FEF3C7" />
          <StatCard title="مكافآت مستبدلة" value={business?.total_rewards || 0} icon="card-giftcard" iconColor={Colors.error} iconBg={Colors.errorLight} trend="+8%" trendUp />
          {isWeb ? (
            <>
              <StatCard title="طوابع اليوم" value={todayVisits * 2} icon="local-cafe" iconColor="#8B5CF6" iconBg="#F3E8FF" />
              <StatCard title="زيارات اليوم" value={todayVisits} icon="store" iconColor="#10B981" iconBg={Colors.successLight} />
            </>
          ) : null}
        </View>

        {/* Two-column on desktop */}
        <View style={[isWeb && styles.twoCol]}>
          {/* Transactions */}
          <View style={[isWeb && styles.colLeft]}>
            <Text style={styles.sectionTitle}>أحدث العمليات</Text>
            <View style={styles.transactionsCard}>
              {transactions.slice(0, 6).map((tx, i) => (
                <View key={tx.id} style={[styles.txItem, i < transactions.length - 1 && styles.txBorder]}>
                  <View style={[styles.txIconBox, {
                    backgroundColor: tx.type === 'stamp' ? '#EEF2FF' : tx.type === 'points' ? '#FEF3C7' : Colors.successLight
                  }]}>
                    <MaterialIcons
                      name={tx.type === 'stamp' ? 'local-cafe' : tx.type === 'points' ? 'star' : 'card-giftcard'}
                      size={20}
                      color={tx.type === 'stamp' ? Colors.primary : tx.type === 'points' ? Colors.gold : Colors.success}
                    />
                  </View>
                  <View style={styles.txContent}>
                    <Text style={styles.txCustomer}>{tx.customer_name}</Text>
                    <Text style={styles.txMeta}>{tx.employee} · {tx.branch}</Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txValue, { color: tx.type === 'reward' ? Colors.success : Colors.primary }]}>{tx.value}</Text>
                    <Text style={styles.txTime}>{tx.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Top Customers */}
          <View style={[isWeb && styles.colRight]}>
            <Text style={styles.sectionTitle}>أكثر العملاء تفاعلًا</Text>
            <View style={styles.transactionsCard}>
              {customers.slice(0, 5).map((c, i) => (
                <Pressable
                  key={c.id}
                  style={[styles.customerRow, i < 4 && styles.txBorder]}
                  onPress={() => router.push(`/(business)/wallet/${c.id}` as any)}
                >
                  <MaterialIcons name="chevron-left" size={18} color={Colors.textLight} />
                  <View>
                    <Text style={styles.custPoints}>{c.points} نقطة</Text>
                    <Text style={styles.custVisits}>{c.total_visits} زيارة</Text>
                  </View>
                  <View style={styles.txContent}>
                    <Text style={styles.txCustomer}>{c.name}</Text>
                    <Text style={styles.txMeta}>{c.phone}</Text>
                  </View>
                  <View style={[styles.custAvatar, { backgroundColor: Colors.primary }]}>
                    <Text style={styles.custAvatarText}>{c.name.charAt(0)}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Chart */}
        <Text style={styles.sectionTitle}>نمو الزيارات الشهري</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartBars}>
            {[45, 62, 78, 55, 89, 95, 72, 88, 102, 115, 98, 125].map((val, i) => (
              <View key={i} style={styles.chartBarWrap}>
                <View style={[styles.chartBar, { height: (val / 125) * (isWeb ? 120 : 80), backgroundColor: i === 11 ? Colors.gold : Colors.primary + '60' }]} />
                <Text style={styles.chartLabel}>{['ي', 'ف', 'م', 'أ', 'م', 'ي', 'ي', 'أ', 'س', 'أ', 'ن', 'د'][i]}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartTitle}>زيارات العملاء - ٢٠٢٦</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { flex: 1 },
  greetingBanner: { borderRadius: BorderRadius.xl, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  greetingBannerWeb: { marginBottom: Spacing.lg },
  greetingContent: { flex: 1 },
  greetingName: { color: Colors.white, fontSize: 22, ...Fonts.bold, marginBottom: 4 },
  greetingBusiness: { color: Colors.goldLight, fontSize: 14, ...Fonts.medium, marginBottom: 4 },
  greetingDate: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  greetingBadge: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, ...Shadows.small, marginBottom: Spacing.md, justifyContent: 'space-around' },
  quickActionsWeb: { justifyContent: 'flex-start', gap: 8 },
  quickAction: { alignItems: 'center', gap: 6, padding: 8 },
  quickActionWeb: { width: 90, padding: 12, borderRadius: BorderRadius.lg, backgroundColor: Colors.gray50 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { fontSize: 12, color: Colors.text, ...Fonts.medium },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 10, marginTop: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  statsGridWeb: { flexDirection: 'row', flexWrap: 'wrap' },
  twoCol: { flexDirection: 'row', gap: Spacing.md },
  colLeft: { flex: 1.2 },
  colRight: { flex: 1 },
  transactionsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, ...Shadows.small, overflow: 'hidden', marginBottom: Spacing.md },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txContent: { flex: 1 },
  txCustomer: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  txMeta: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right', marginTop: 2 },
  txRight: { alignItems: 'flex-start' },
  txValue: { fontSize: 14, ...Fonts.bold },
  txTime: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  customerRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 10 },
  custAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  custAvatarText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  custPoints: { fontSize: 12, ...Fonts.bold, color: Colors.gold, textAlign: 'left' },
  custVisits: { fontSize: 11, color: Colors.textSecondary, textAlign: 'left' },
  chartCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.small, marginBottom: Spacing.md },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 4, marginBottom: 8 },
  chartBarWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  chartBar: { width: '75%', borderRadius: 3, marginBottom: 4 },
  chartLabel: { fontSize: 9, color: Colors.textSecondary },
  chartTitle: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', ...Fonts.medium },
});
