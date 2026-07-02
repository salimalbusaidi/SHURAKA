// Powered by OnSpace.AI - Subscription & Billing with updated pricing
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { SUBSCRIPTION_PLANS } from '@/constants/mockData';
import { useAlert } from '@/template';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'نشط', color: Colors.success, bg: Colors.successLight },
  trialing:  { label: 'تجربة مجانية', color: '#2563EB', bg: '#EFF6FF' },
  past_due:  { label: 'متأخر', color: Colors.warning, bg: Colors.warningLight },
  canceled:  { label: 'ملغي', color: Colors.error, bg: '#FEF2F2' },
  unpaid:    { label: 'غير مدفوع', color: Colors.error, bg: '#FEF2F2' },
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const { showAlert } = useAlert();
  const [selected, setSelected] = useState(business?.subscription_plan || 'growth');

  const currentPlanId = business?.subscription_plan || 'growth';
  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === currentPlanId) || SUBSCRIPTION_PLANS[1];
  const statusInfo = STATUS_MAP[business?.subscription_status || 'active'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>الاشتراك والفوترة</Text>
        <View style={{ width: 32 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Current Plan Card */}
        <LinearGradient colors={[Colors.gold, Colors.goldDark]} style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
              <Text style={styles.statusText}>{statusInfo.label}</Text>
            </View>
            <Text style={styles.currentPlanLabel}>الباقة الحالية</Text>
          </View>

          <Text style={styles.currentPlanName}>{currentPlan.name}</Text>
          <Text style={styles.currentPlanPrice}>
            {currentPlan.price} {currentPlan.currency} / شهريًا
          </Text>

          <View style={styles.currentPlanDates}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>تاريخ التجديد</Text>
              <Text style={styles.dateValue}>٢ أغسطس ٢٠٢٦</Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>بداية الاشتراك</Text>
              <Text style={styles.dateValue}>٢ يوليو ٢٠٢٦</Text>
            </View>
          </View>

          {/* Trial notice if applicable */}
          {business?.subscription_status === 'trialing' ? (
            <View style={styles.trialBanner}>
              <MaterialIcons name="hourglass-empty" size={16} color={Colors.white} />
              <Text style={styles.trialText}>متبقي ٧ أيام في التجربة المجانية</Text>
            </View>
          ) : null}
        </LinearGradient>

        {/* Manage Buttons */}
        <View style={styles.manageRow}>
          <Pressable style={styles.manageBtn} onPress={() => showAlert('', 'فتح Stripe Customer Portal لإدارة طريقة الدفع')}>
            <MaterialIcons name="credit-card" size={18} color={Colors.primary} />
            <Text style={styles.manageBtnText}>إدارة الدفع</Text>
          </Pressable>
          <Pressable style={styles.manageBtn} onPress={() => showAlert('', 'فتح سجل الفواتير الكامل')}>
            <MaterialIcons name="receipt-long" size={18} color={Colors.primary} />
            <Text style={styles.manageBtnText}>الفواتير</Text>
          </Pressable>
          <Pressable style={styles.manageBtn} onPress={() => showAlert('', 'إحصائيات الاستخدام')}>
            <MaterialIcons name="analytics" size={18} color={Colors.primary} />
            <Text style={styles.manageBtnText}>الاستخدام</Text>
          </Pressable>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>خطط الاشتراك</Text>
        {SUBSCRIPTION_PLANS.map(plan => (
          <Pressable
            key={plan.id}
            style={[styles.planCard, selected === plan.id && styles.planCardSelected]}
            onPress={() => setSelected(plan.id)}
          >
            {plan.popular ? (
              <View style={styles.popularBanner}>
                <Text style={styles.popularBannerText}>الأكثر اختيارًا</Text>
              </View>
            ) : null}
            <View style={styles.planRow}>
              <View>
                <Text style={[styles.planPrice, { color: plan.color }]}>
                  {plan.price}
                  <Text style={styles.planCurrency}> {plan.currency}</Text>
                </Text>
                <Text style={styles.planPeriod}>شهريًا</Text>
              </View>
              <View style={styles.planInfo}>
                <View style={styles.planNameRow}>
                  {plan.id === currentPlanId ? (
                    <View style={styles.currentTag}>
                      <Text style={styles.currentTagText}>الحالية</Text>
                    </View>
                  ) : null}
                  <Text style={styles.planName}>{plan.name}</Text>
                </View>
                <Text style={styles.planDesc}>
                  {plan.features.filter(f => f.included).slice(0, 2).map(f => f.text).join(' · ')}
                </Text>
              </View>
              <View style={[styles.radio, selected === plan.id && { borderColor: plan.color }]}>
                {selected === plan.id ? <View style={[styles.radioDot, { backgroundColor: plan.color }]} /> : null}
              </View>
            </View>

            {/* Features preview */}
            {selected === plan.id ? (
              <View style={styles.featuresExpanded}>
                {plan.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <MaterialIcons
                      name={f.included ? 'check-circle' : 'cancel'}
                      size={16}
                      color={f.included ? Colors.success : Colors.gray300}
                    />
                    <Text style={[styles.featureText, !f.included && styles.featureTextOff]}>
                      {f.text}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Pressable>
        ))}

        {selected !== currentPlanId ? (
          <Pressable
            style={styles.upgradeBtn}
            onPress={() => showAlert(
              'تغيير الباقة',
              `سيتم الانتقال إلى باقة ${SUBSCRIPTION_PLANS.find(p => p.id === selected)?.name} — ${SUBSCRIPTION_PLANS.find(p => p.id === selected)?.price} ر.ع / شهريًا`,
              [
                { text: 'تأكيد', onPress: () => {} },
                { text: 'إلغاء', style: 'cancel' },
              ]
            )}
          >
            <MaterialIcons name="rocket-launch" size={20} color={Colors.white} />
            <Text style={styles.upgradeBtnText}>
              الترقية إلى {SUBSCRIPTION_PLANS.find(p => p.id === selected)?.name}
            </Text>
          </Pressable>
        ) : null}

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>طريقة الدفع</Text>
        <View style={styles.paymentCard}>
          <Pressable
            style={styles.paymentMethod}
            onPress={() => showAlert('', 'تعديل طريقة الدفع عبر Stripe Portal')}
          >
            <MaterialIcons name="chevron-left" size={20} color={Colors.textLight} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentLabel}>بطاقة ائتمانية</Text>
              <Text style={styles.paymentValue}>**** **** **** 4242</Text>
            </View>
            <MaterialIcons name="credit-card" size={28} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Invoices */}
        <Text style={styles.sectionTitle}>الفواتير السابقة</Text>
        {[
          { date: 'يونيو ٢٠٢٦', amount: `${currentPlan.price} ر.ع`, status: 'مدفوعة', statusColor: Colors.success },
          { date: 'مايو ٢٠٢٦', amount: `${currentPlan.price} ر.ع`, status: 'مدفوعة', statusColor: Colors.success },
          { date: 'أبريل ٢٠٢٦', amount: '8 ر.ع', status: 'مدفوعة', statusColor: Colors.success },
        ].map((inv, i) => (
          <View key={i} style={styles.invoiceRow}>
            <Pressable
              style={styles.downloadBtn}
              onPress={() => showAlert('', 'تحميل الفاتورة')}
            >
              <MaterialIcons name="download" size={16} color={Colors.primary} />
            </Pressable>
            <View style={styles.invoiceStatus}>
              <View style={[styles.paidDot, { backgroundColor: inv.statusColor }]} />
              <Text style={[styles.invoiceStatusText, { color: inv.statusColor }]}>
                {inv.status}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.invoiceDate}>{inv.date}</Text>
            </View>
            <Text style={styles.invoiceAmount}>{inv.amount}</Text>
          </View>
        ))}

        {/* Cancel */}
        <Pressable
          style={styles.cancelBtn}
          onPress={() => showAlert(
            'إلغاء الاشتراك',
            'هل أنت متأكد؟ يمكنك الاستمرار في استخدام الخدمة حتى نهاية الفترة المدفوعة.',
            [
              { text: 'تراجع', style: 'cancel' },
              { text: 'إلغاء الاشتراك', style: 'destructive', onPress: () => {} },
            ]
          )}
        >
          <Text style={styles.cancelBtnText}>إلغاء الاشتراك</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  currentPlanCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.gold },
  currentPlanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  currentPlanLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: Colors.white, fontSize: 12, ...Fonts.semiBold },
  currentPlanName: { color: Colors.white, fontSize: 28, ...Fonts.bold, marginBottom: 4 },
  currentPlanPrice: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 16 },
  currentPlanDates: { flexDirection: 'row', gap: 24 },
  dateItem: { alignItems: 'flex-end' },
  dateLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 },
  dateValue: { color: Colors.white, fontSize: 14, ...Fonts.semiBold },
  trialBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: BorderRadius.md, padding: Spacing.sm },
  trialText: { color: Colors.white, fontSize: 13, ...Fonts.semiBold },
  manageRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  manageBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 12, ...Shadows.small },
  manageBtnText: { fontSize: 12, ...Fonts.semiBold, color: Colors.primary },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 10 },
  planCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md,
    marginBottom: 10, ...Shadows.small, borderWidth: 1.5, borderColor: Colors.border,
    overflow: 'hidden',
  },
  planCardSelected: { borderColor: Colors.gold, backgroundColor: '#FFFDF5' },
  popularBanner: { backgroundColor: Colors.gold, marginHorizontal: -16, marginTop: -16, marginBottom: 12, paddingVertical: 6, alignItems: 'center' },
  popularBannerText: { color: Colors.white, fontSize: 12, ...Fonts.bold },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planInfo: { flex: 1 },
  planNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 },
  planName: { fontSize: 17, ...Fonts.bold, color: Colors.text },
  planDesc: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  planPrice: { fontSize: 24, ...Fonts.extraBold },
  planCurrency: { fontSize: 14, ...Fonts.medium, color: Colors.textSecondary },
  planPeriod: { fontSize: 11, color: Colors.textSecondary },
  currentTag: { backgroundColor: Colors.successLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  currentTagText: { color: Colors.success, fontSize: 10, ...Fonts.bold },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  featuresExpanded: { marginTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12, gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { flex: 1, fontSize: 13, color: Colors.text, textAlign: 'right' },
  featureTextOff: { color: Colors.textLight, textDecorationLine: 'line-through' },
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: Colors.gold, height: 54, borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg, ...Shadows.gold,
  },
  upgradeBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
  paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, ...Shadows.small, marginBottom: Spacing.lg, overflow: 'hidden' },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing.md },
  paymentLabel: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  paymentValue: { fontSize: 15, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  invoiceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: 8, ...Shadows.small,
  },
  invoiceDate: { fontSize: 15, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  invoiceAmount: { fontSize: 16, ...Fonts.bold, color: Colors.primary },
  invoiceStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  paidDot: { width: 8, height: 8, borderRadius: 4 },
  invoiceStatusText: { fontSize: 12, ...Fonts.medium },
  downloadBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { alignItems: 'center', padding: Spacing.lg },
  cancelBtnText: { color: Colors.error, fontSize: 15, ...Fonts.semiBold },
});
