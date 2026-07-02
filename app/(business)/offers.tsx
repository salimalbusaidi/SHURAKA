// Powered by OnSpace.AI - Offers & Notifications
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { Badge } from '@/components/ui/Badge';
import { UpsellModal } from '@/components/layout/UpsellModal';
import { useAlert } from '@/template';

export default function OffersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notifications, currentPlan } = useBusiness();
  const { showAlert } = useAlert();
  const [upsell, setUpsell] = useState(false);

  const statusBadge: Record<string, any> = { sent: 'success', scheduled: 'info', draft: 'default' };
  const statusLabel: Record<string, string> = { sent: 'مُرسل', scheduled: 'مجدول', draft: 'مسودة' };

  const automations = [
    { icon: 'waving-hand', title: 'رسالة الترحيب', desc: 'تُرسل تلقائيًا عند انضمام عميل جديد', active: currentPlan !== 'starter', plan: 'نمو' },
    { icon: 'cake', title: 'تهنئة عيد الميلاد', desc: 'تُرسل في يوم ميلاد العميل بخصم خاص', active: currentPlan === 'plus', plan: 'شركاء بلس' },
    { icon: 'replay', title: 'استعادة العملاء', desc: 'للعملاء الذين لم يزوروا منذ 30 يوم', active: currentPlan === 'plus', plan: 'شركاء بلس' },
    { icon: 'timer', title: 'قرب انتهاء العرض', desc: 'تذكير للعملاء قبل انتهاء العروض', active: currentPlan === 'plus', plan: 'شركاء بلس' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()}><MaterialIcons name="arrow-forward" size={24} color={Colors.white} /></Pressable>
        <Text style={styles.headerTitle}>العروض والإشعارات</Text>
        <Pressable style={styles.addBtn} onPress={() => showAlert('إنشاء إشعار', 'سيتوفر قريبًا')}>
          <MaterialIcons name="add" size={22} color={Colors.white} />
        </Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Quick Send */}
        <View style={styles.quickSendCard}>
          <Text style={styles.quickSendTitle}>إرسال سريع</Text>
          <View style={styles.quickSendBtns}>
            {[
              { icon: 'people', label: 'للجميع', color: Colors.primary },
              { icon: 'filter-list', label: 'فئة محددة', color: Colors.success },
              { icon: 'do-not-disturb-off', label: 'غير نشطين', color: Colors.warning },
            ].map((btn, i) => (
              <Pressable key={i} style={styles.quickSendBtn} onPress={() => showAlert('', `إرسال إشعار لـ${btn.label}`)}>
                <View style={[styles.quickSendIcon, { backgroundColor: btn.color + '20' }]}>
                  <MaterialIcons name={btn.icon as any} size={22} color={btn.color} />
                </View>
                <Text style={styles.quickSendLabel}>{btn.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Automations */}
        <Text style={styles.sectionTitle}>الإشعارات التلقائية</Text>
        {automations.map((auto, i) => (
          <View key={i} style={styles.autoCard}>
            <View style={styles.autoToggle}>
              <View style={[styles.toggle, auto.active && styles.toggleActive]}>
                <View style={[styles.toggleDot, auto.active && styles.toggleDotActive]} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.autoTitle}>{auto.title}</Text>
              <Text style={styles.autoDesc}>{auto.desc}</Text>
              {!auto.active ? (
                <Pressable onPress={() => setUpsell(true)}>
                  <Text style={styles.autoUpgrade}>يتطلب باقة {auto.plan} ↑</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={[styles.autoIcon, { backgroundColor: auto.active ? Colors.successLight : Colors.gray100 }]}>
              <MaterialIcons name={auto.icon as any} size={24} color={auto.active ? Colors.success : Colors.gray400} />
            </View>
          </View>
        ))}

        {/* History */}
        <Text style={styles.sectionTitle}>سجل الإشعارات</Text>
        {notifications.map(n => (
          <View key={n.id} style={styles.notifCard}>
            <View style={styles.notifHeader}>
              <Badge label={statusLabel[n.status] || n.status} variant={statusBadge[n.status] || 'default'} size="sm" />
              <Text style={styles.notifTitle}>{n.title}</Text>
            </View>
            <Text style={styles.notifMessage}>{n.message}</Text>
            <View style={styles.notifMeta}>
              {n.engagement !== '-' ? (
                <View style={styles.engagementBar}>
                  <View style={[styles.engFill, { width: n.engagement }]} />
                </View>
              ) : null}
              <Text style={styles.notifAudience}>{n.audience}</Text>
              <Text style={styles.notifTime}>{n.sent_at}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <UpsellModal visible={upsell} onClose={() => setUpsell(false)} feature="الإشعارات التلقائية" requiredPlan="شركاء بلس" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  quickSendCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.small },
  quickSendTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 14 },
  quickSendBtns: { flexDirection: 'row', justifyContent: 'space-around' },
  quickSendBtn: { alignItems: 'center', gap: 8 },
  quickSendIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  quickSendLabel: { fontSize: 13, color: Colors.text, ...Fonts.medium },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 10 },
  autoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  autoIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  autoTitle: { fontSize: 15, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 2 },
  autoDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  autoUpgrade: { fontSize: 12, color: Colors.gold, ...Fonts.semiBold, marginTop: 4 },
  autoToggle: { justifyContent: 'center' },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: Colors.gray200, padding: 2, justifyContent: 'center' },
  toggleActive: { backgroundColor: Colors.success },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.white },
  toggleDotActive: { alignSelf: 'flex-end' },
  notifCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-end', marginBottom: 8 },
  notifTitle: { fontSize: 15, ...Fonts.bold, color: Colors.text },
  notifMessage: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', marginBottom: 10, lineHeight: 20 },
  notifMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  engagementBar: { flex: 1, height: 6, backgroundColor: Colors.gray100, borderRadius: 3, overflow: 'hidden' },
  engFill: { height: 6, backgroundColor: Colors.success, borderRadius: 3 },
  notifAudience: { fontSize: 11, color: Colors.textSecondary },
  notifTime: { fontSize: 11, color: Colors.textLight },
});
