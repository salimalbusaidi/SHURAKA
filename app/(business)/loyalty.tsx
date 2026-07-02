// Powered by OnSpace.AI - Loyalty Programs
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { TopBar } from '@/components/layout/TopBar';
import { UpsellModal } from '@/components/layout/UpsellModal';
import { useAlert } from '@/template';

export default function LoyaltyScreen() {
  const { loyaltyPrograms, currentPlan } = useBusiness();
  const { showAlert } = useAlert();
  const [upsell, setUpsell] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const canAdd = currentPlan !== 'starter' || loyaltyPrograms.length < 1;

  const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
    stamps: { icon: 'local-cafe', color: Colors.primary, bg: '#EEF2FF', label: 'بطاقة طوابع' },
    points: { icon: 'star', color: Colors.gold, bg: '#FEF3C7', label: 'نظام نقاط' },
    coupon: { icon: 'local-offer', color: Colors.error, bg: Colors.errorLight, label: 'كوبون خصم' },
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable style={styles.addBtn} onPress={() => canAdd ? showAlert('قريبًا', 'إنشاء برنامج ولاء جديد') : setUpsell(true)}>
            <MaterialIcons name="add" size={18} color={Colors.white} />
            <Text style={styles.addBtnText}>برنامج جديد</Text>
          </Pressable>
          <Text style={styles.headerTitle}>برامج الولاء</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {loyaltyPrograms.map(lp => {
          const cfg = typeConfig[lp.type] || typeConfig.stamps;
          return (
            <Pressable key={lp.id} style={styles.programCard} onPress={() => setSelected(lp)}>
              <LinearGradient colors={[lp.color + 'EE', lp.color + 'CC']} style={styles.programGradient}>
                <View style={styles.programHeader}>
                  <View style={styles.programStatus}>
                    <View style={[styles.statusDot, { backgroundColor: lp.status === 'active' ? Colors.success : Colors.gray400 }]} />
                    <Text style={styles.statusText}>{lp.status === 'active' ? 'نشط' : 'موقوف'}</Text>
                  </View>
                  <View style={styles.programTop}>
                    <View style={[styles.programIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <MaterialIcons name={cfg.icon as any} size={28} color={Colors.white} />
                    </View>
                    <View style={styles.programInfo}>
                      <Text style={styles.programType}>{cfg.label}</Text>
                      <Text style={styles.programName}>{lp.name}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.programDesc}>{lp.description}</Text>
                <View style={styles.programStats}>
                  <View style={styles.programStat}>
                    <Text style={styles.programStatValue}>{lp.total_issued.toLocaleString('ar')}</Text>
                    <Text style={styles.programStatLabel}>صادر</Text>
                  </View>
                  <View style={styles.programStat}>
                    <Text style={styles.programStatValue}>{lp.total_redeemed}</Text>
                    <Text style={styles.programStatLabel}>مستبدل</Text>
                  </View>
                  <View style={styles.programStat}>
                    <Text style={styles.programStatValue}>{Math.round((lp.total_redeemed / Math.max(1, lp.total_issued)) * 100)}%</Text>
                    <Text style={styles.programStatLabel}>معدل</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}

        {/* Add New Types */}
        <Text style={styles.sectionTitle}>أنواع البرامج المتاحة</Text>
        {[
          { type: 'birthday', icon: 'cake', color: '#EC4899', label: 'مكافأة عيد الميلاد', desc: 'خصم تلقائي في يوم ميلاد العميل', plan: 'growth' },
          { type: 'winback', icon: 'replay', color: '#8B5CF6', label: 'استعادة العملاء', desc: 'عرض خاص للعملاء الذين لم يزوروا منذ فترة', plan: 'plus' },
          { type: 'seasonal', icon: 'event', color: '#F59E0B', label: 'عروض موسمية', desc: 'عروض خاصة بالمناسبات والمواسم', plan: 'growth' },
        ].map((item, i) => (
          <Pressable key={i} style={styles.typeCard} onPress={() => setUpsell(true)}>
            <View style={styles.lockBadge}>
              <MaterialIcons name="lock" size={14} color={Colors.white} />
              <Text style={styles.lockText}>باقة {item.plan === 'growth' ? 'نمو' : 'شركاء بلس'}</Text>
            </View>
            <View style={[styles.typeIcon, { backgroundColor: item.color + '20' }]}>
              <MaterialIcons name={item.icon as any} size={26} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.typeLabel}>{item.label}</Text>
              <Text style={styles.typeDesc}>{item.desc}</Text>
            </View>
            <MaterialIcons name="arrow-back-ios" size={16} color={Colors.textLight} />
          </Pressable>
        ))}
      </ScrollView>

      <UpsellModal visible={upsell} onClose={() => setUpsell(false)} feature="برامج ولاء إضافية" requiredPlan="نمو" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { backgroundColor: Colors.white, padding: Spacing.md, ...Shadows.small },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, ...Fonts.bold, color: Colors.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.md },
  addBtnText: { color: Colors.white, fontSize: 14, ...Fonts.semiBold },
  programCard: { borderRadius: BorderRadius.xl, marginBottom: Spacing.md, overflow: 'hidden', ...Shadows.medium },
  programGradient: { padding: Spacing.lg },
  programHeader: { marginBottom: 12 },
  programStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end', marginBottom: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, ...Fonts.medium },
  programTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  programIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  programInfo: { flex: 1 },
  programType: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 2 },
  programName: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  programDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'right', marginBottom: 16, lineHeight: 22 },
  programStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: BorderRadius.md, padding: 12 },
  programStat: { flex: 1, alignItems: 'center' },
  programStatValue: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  programStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 12 },
  typeCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 10, ...Shadows.small, position: 'relative' },
  lockBadge: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gold, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  lockText: { color: Colors.white, fontSize: 10, ...Fonts.bold },
  typeIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  typeLabel: { fontSize: 15, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 4 },
  typeDesc: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
});
