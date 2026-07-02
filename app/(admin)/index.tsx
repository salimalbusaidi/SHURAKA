// Powered by OnSpace.AI - Admin Dashboard (Web-optimized with Sidebar)
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_BUSINESSES, ADMIN_STATS, SUBSCRIPTION_PLANS } from '@/constants/mockData';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/useResponsive';
import Sidebar from '@/components/layout/Sidebar';
import WebTopBar from '@/components/layout/WebTopBar';
import { useAlert } from '@/template';

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { showAlert } = useAlert();
  const { isDesktop, isTablet, contentPadding } = useResponsive();
  const isWeb = Platform.OS === 'web' && (isDesktop || isTablet);

  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'plans' | 'audit'>('overview');

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace('/(auth)/login'); return; }
    if (user?.role !== 'admin') { router.replace('/(business)'); return; }
  }, [isAuthenticated, isLoading, user]);

  const planLabel: Record<string, string> = { starter: 'انطلاقة', growth: 'نمو', partners_plus: 'شركاء بلس' };
  const planBadge: Record<string, any> = { starter: 'info', growth: 'success', partners_plus: 'gold' };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: 'dashboard' },
    { id: 'businesses', label: 'الأعمال', icon: 'store' },
    { id: 'plans', label: 'الباقات', icon: 'credit-card' },
    { id: 'audit', label: 'Audit Log', icon: 'history' },
  ];

  const content = (
    <ScrollView
      contentContainerStyle={{ padding: contentPadding, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {activeTab === 'overview' && (
        <>
          {/* Revenue Card */}
          <LinearGradient colors={[Colors.gold, Colors.goldDark]} style={styles.revenueCard}>
            <View>
              <Text style={styles.revenueLabel}>الإيرادات الشهرية</Text>
              <Text style={styles.revenueValue}>{ADMIN_STATS.monthly_revenue} ر.ع</Text>
              <View style={styles.revenueTrend}>
                <MaterialIcons name="trending-up" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.revenueTrendText}>+{ADMIN_STATS.revenue_growth}% عن الشهر الماضي</Text>
              </View>
            </View>
            <MaterialIcons name="monetization-on" size={56} color="rgba(255,255,255,0.25)" />
          </LinearGradient>

          {/* KPI Grid */}
          <View style={[styles.statsGrid, isWeb && styles.statsGridWeb]}>
            <StatCard title="إجمالي الأعمال" value={ADMIN_STATS.total_businesses} icon="store" iconColor={Colors.primary} iconBg="#EEF2FF" />
            <StatCard title="اشتراكات نشطة" value={ADMIN_STATS.active_subscriptions} icon="card-membership" iconColor={Colors.success} iconBg={Colors.successLight} />
            <StatCard title="إجمالي العملاء" value={ADMIN_STATS.total_customers.toLocaleString('ar')} icon="people" iconColor="#8B5CF6" iconBg="#F3E8FF" />
            <StatCard title="معدل الانحسار" value={`${ADMIN_STATS.churn_rate}%`} icon="trending-down" iconColor={Colors.error} iconBg={Colors.errorLight} />
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>إجراءات النظام</Text>
          <View style={[isWeb && styles.actionGrid]}>
            {[
              { icon: 'notification-important', label: 'إرسال تنبيه عام', color: Colors.warning, bg: Colors.warningLight },
              { icon: 'support-agent', label: 'طلبات الدعم الفني', color: Colors.info, bg: Colors.infoLight },
              { icon: 'history', label: 'سجل العمليات', color: Colors.primary, bg: '#EEF2FF' },
              { icon: 'cloud-download', label: 'تصدير تقرير شامل', color: Colors.success, bg: Colors.successLight },
              { icon: 'block', label: 'تعطيل حسابات', color: Colors.error, bg: Colors.errorLight },
              { icon: 'email', label: 'إرسال رسالة جماعية', color: '#8B5CF6', bg: '#F3E8FF' },
            ].map((item, i) => (
              <Pressable
                key={i}
                style={[styles.actionRow, isWeb && styles.actionRowWeb]}
                onPress={() => showAlert('', item.label)}
              >
                <MaterialIcons name="arrow-back-ios" size={16} color={Colors.textLight} />
                <Text style={styles.actionLabel}>{item.label}</Text>
                <View style={[styles.actionIcon, { backgroundColor: item.bg }]}>
                  <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                </View>
              </Pressable>
            ))}
          </View>

          {/* Businesses */}
          <Text style={styles.sectionTitle}>آخر الأعمال المسجلة</Text>
          {MOCK_BUSINESSES.map(biz => (
            <View key={biz.id} style={styles.bizRow}>
              <View style={styles.bizActions}>
                <Pressable style={styles.bizActionBtn} onPress={() => showAlert('', `عرض تفاصيل ${biz.business_name}`)}>
                  <MaterialIcons name="visibility" size={16} color={Colors.primary} />
                </Pressable>
                <Pressable style={styles.bizActionBtn} onPress={() => showAlert('', `تعطيل ${biz.business_name}`)}>
                  <MaterialIcons name="block" size={16} color={Colors.error} />
                </Pressable>
              </View>
              <View style={styles.bizInfo}>
                <View style={styles.bizNameRow}>
                  <Badge label={planLabel[biz.subscription_plan] || biz.subscription_plan} variant={planBadge[biz.subscription_plan] || 'default'} size="sm" />
                  <Text style={styles.bizName}>{biz.business_name}</Text>
                </View>
                <Text style={styles.bizMeta}>{biz.category} · {biz.total_customers} عميل</Text>
              </View>
              <View style={styles.bizAvatar}>
                <Text style={styles.bizAvatarText}>{biz.business_name.charAt(0)}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      {activeTab === 'businesses' && (
        <>
          <Text style={styles.sectionTitle}>جميع الأعمال ({MOCK_BUSINESSES.length})</Text>
          <View style={isWeb ? styles.cardGrid : undefined}>
            {MOCK_BUSINESSES.map(biz => (
              <View key={biz.id} style={[styles.bizDetailCard, isWeb && styles.bizDetailCardWeb]}>
                <View style={styles.bizDetailHeader}>
                  <Badge label={planLabel[biz.subscription_plan] || biz.subscription_plan} variant={planBadge[biz.subscription_plan] || 'default'} />
                  <Text style={styles.bizDetailName}>{biz.business_name}</Text>
                </View>
                <Text style={styles.bizDetailCategory}>{biz.category}</Text>
                <View style={styles.bizDetailStats}>
                  <View style={styles.bizDetailStat}><Text style={styles.bizDetailStatVal}>{biz.total_customers}</Text><Text style={styles.bizDetailStatLbl}>عميل</Text></View>
                  <View style={styles.bizDetailStat}><Text style={styles.bizDetailStatVal}>{biz.total_rewards}</Text><Text style={styles.bizDetailStatLbl}>مكافأة</Text></View>
                  <View style={styles.bizDetailStat}><Text style={styles.bizDetailStatVal}>{biz.rating}⭐</Text><Text style={styles.bizDetailStatLbl}>تقييم</Text></View>
                </View>
                <View style={styles.bizDetailActions}>
                  <Pressable style={[styles.bizBtn, { borderColor: Colors.error }]} onPress={() => showAlert('', `تعطيل ${biz.business_name}`)}>
                    <Text style={[styles.bizBtnText, { color: Colors.error }]}>تعطيل</Text>
                  </Pressable>
                  <Pressable style={[styles.bizBtn, { backgroundColor: Colors.primary, borderColor: Colors.primary }]} onPress={() => showAlert('دخول للدعم', 'ستُسجَّل هذه العملية في Audit Log')}>
                    <Text style={[styles.bizBtnText, { color: Colors.white }]}>دخول للدعم</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {activeTab === 'plans' && (
        <>
          <Text style={styles.sectionTitle}>إدارة الباقات والأسعار</Text>
          <View style={isWeb ? styles.cardGrid : undefined}>
            {SUBSCRIPTION_PLANS.map(plan => (
              <View key={plan.id} style={[styles.adminPlanCard, isWeb && styles.adminPlanCardWeb]}>
                <View style={styles.adminPlanHeader}>
                  <Pressable style={styles.editPlanBtn} onPress={() => showAlert('', `تعديل باقة ${plan.name}`)}>
                    <MaterialIcons name="edit" size={16} color={Colors.primary} />
                    <Text style={styles.editPlanText}>تعديل</Text>
                  </Pressable>
                  <View>
                    <Text style={styles.adminPlanName}>{plan.name}</Text>
                    <Text style={styles.adminPlanPrice}>{plan.price} {plan.currency} / شهر</Text>
                  </View>
                </View>
                <View style={styles.adminPlanStats}>
                  <View style={styles.adminPlanStat}>
                    <Text style={styles.adminPlanStatVal}>
                      {MOCK_BUSINESSES.filter(b => b.subscription_plan === plan.id).length}
                    </Text>
                    <Text style={styles.adminPlanStatLbl}>مشترك</Text>
                  </View>
                  <View style={styles.adminPlanStat}>
                    <Text style={styles.adminPlanStatVal}>
                      {MOCK_BUSINESSES.filter(b => b.subscription_plan === plan.id).length * plan.price} ر.ع
                    </Text>
                    <Text style={styles.adminPlanStatLbl}>إيراد شهري</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {activeTab === 'audit' && (
        <>
          <Text style={styles.sectionTitle}>سجل العمليات - Audit Log</Text>
          {[
            { user: 'محمد الحارثي', action: 'إضافة عميل جديد: فاطمة الزهراء', time: 'اليوم، 10:30 ص', type: 'create', ip: '192.168.1.1' },
            { user: 'سعيد المنذري', action: 'إضافة طابع للعميل: أحمد محمود', time: 'اليوم، 09:15 ص', type: 'update', ip: '192.168.1.2' },
            { user: 'مدير النظام', action: 'تفعيل باقة نمو للمستخدم: user_002', time: 'أمس، 06:00 م', type: 'admin', ip: '10.0.0.1' },
            { user: 'محمد الحارثي', action: 'تسجيل دخول ناجح', time: 'أمس، 08:00 ص', type: 'auth', ip: '192.168.1.1' },
            { user: 'نور الهدى (عميل)', action: 'استبدال مكافأة: قهوة مجانية', time: 'منذ يومين', type: 'reward', ip: '192.168.2.5' },
          ].map((log, i) => (
            <View key={i} style={styles.auditRow}>
              <View style={styles.auditMeta}>
                <Text style={styles.auditIp}>{log.ip}</Text>
                <Text style={styles.auditTime}>{log.time}</Text>
              </View>
              <View style={styles.auditContent}>
                <Text style={styles.auditAction}>{log.action}</Text>
                <Text style={styles.auditUser}>{log.user}</Text>
              </View>
              <View style={[styles.auditDot, {
                backgroundColor:
                  log.type === 'admin' ? Colors.warning :
                    log.type === 'auth' ? Colors.info :
                      log.type === 'reward' ? Colors.gold :
                        log.type === 'create' ? Colors.success : Colors.primary
              }]} />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );

  // Desktop layout with sidebar
  if (isWeb) {
    return (
      <View style={styles.webLayout}>
        <Sidebar collapsed={isTablet} />
        <View style={styles.webMain}>
          <WebTopBar title="لوحة إدارة النظام" />
          <View style={styles.tabsBar}>
            {tabs.map(tab => (
              <Pressable
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <MaterialIcons name={tab.icon as any} size={16} color={activeTab === tab.id ? Colors.white : Colors.textSecondary} />
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            ))}
          </View>
          {content}
        </View>
      </View>
    );
  }

  // Mobile layout
  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={[styles.mobileHeader, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => { logout(); router.replace('/'); }}>
          <MaterialIcons name="logout" size={22} color="rgba(255,255,255,0.7)" />
        </Pressable>
        <View style={styles.adminBadge}>
          <MaterialIcons name="admin-panel-settings" size={16} color={Colors.gold} />
          <Text style={styles.adminBadgeText}>لوحة الإدارة</Text>
        </View>
        <View style={styles.adminAvatar}>
          <MaterialIcons name="manage-accounts" size={22} color={Colors.white} />
        </View>
      </LinearGradient>
      <View style={styles.tabsBar}>
        {tabs.slice(0, 3).map(tab => (
          <Pressable key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id as any)}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  webLayout: { flex: 1, flexDirection: 'row', backgroundColor: Colors.offWhite },
  webMain: { flex: 1, flexDirection: 'column', overflow: 'hidden' } as any,
  mobileHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 12 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  adminBadgeText: { color: Colors.gold, fontSize: 15, ...Fonts.bold },
  adminAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  tabsBar: { flexDirection: 'row', backgroundColor: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: BorderRadius.md },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 12, color: Colors.textSecondary, ...Fonts.medium },
  tabTextActive: { color: Colors.white, ...Fonts.bold },
  revenueCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Shadows.gold },
  revenueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 },
  revenueValue: { color: Colors.white, fontSize: 40, ...Fonts.extraBold, marginBottom: 8 },
  revenueTrend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  revenueTrendText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 10, flexWrap: 'wrap' },
  statsGridWeb: { flexDirection: 'row' },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 10, marginTop: 8 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.md },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  actionRowWeb: { flex: 1, minWidth: 240, marginBottom: 0 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: 15, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  bizRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  bizAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  bizAvatarText: { color: Colors.white, fontSize: 18, ...Fonts.bold },
  bizInfo: { flex: 1 },
  bizNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: 4 },
  bizName: { fontSize: 15, ...Fonts.bold, color: Colors.text },
  bizMeta: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  bizActions: { flexDirection: 'row', gap: 8 },
  bizActionBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  bizDetailCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 10, ...Shadows.small },
  bizDetailCardWeb: { flex: 1, minWidth: 280 },
  bizDetailHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: 4 },
  bizDetailName: { fontSize: 18, ...Fonts.bold, color: Colors.text },
  bizDetailCategory: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', marginBottom: 12 },
  bizDetailStats: { flexDirection: 'row', backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, padding: 10, marginBottom: 12 },
  bizDetailStat: { flex: 1, alignItems: 'center' },
  bizDetailStatVal: { fontSize: 20, ...Fonts.bold, color: Colors.text },
  bizDetailStatLbl: { fontSize: 11, color: Colors.textSecondary },
  bizDetailActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  bizBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.md, borderWidth: 1.5 },
  bizBtnText: { fontSize: 13, ...Fonts.semiBold },
  adminPlanCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 10, ...Shadows.small },
  adminPlanCardWeb: { flex: 1, minWidth: 260 },
  adminPlanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  adminPlanName: { fontSize: 20, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  adminPlanPrice: { fontSize: 14, color: Colors.textSecondary, textAlign: 'right' },
  editPlanBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.md },
  editPlanText: { fontSize: 13, color: Colors.primary, ...Fonts.medium },
  adminPlanStats: { flexDirection: 'row', backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, padding: 12 },
  adminPlanStat: { flex: 1, alignItems: 'center' },
  adminPlanStatVal: { fontSize: 24, ...Fonts.bold, color: Colors.primary },
  adminPlanStatLbl: { fontSize: 12, color: Colors.textSecondary },
  auditRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  auditDot: { width: 12, height: 12, borderRadius: 6 },
  auditContent: { flex: 1 },
  auditAction: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  auditUser: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right', marginTop: 2 },
  auditMeta: { alignItems: 'flex-start' },
  auditTime: { fontSize: 11, color: Colors.textLight },
  auditIp: { fontSize: 11, color: Colors.textSecondary, ...Fonts.medium },
});
