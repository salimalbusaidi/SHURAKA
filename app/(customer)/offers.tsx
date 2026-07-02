// Powered by OnSpace.AI
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAlert } from '@/template';

const OFFERS = [
  { id: 1, title: 'عرض عيد الأضحى', desc: 'خصم 25% على جميع المشروبات طوال أسبوع العيد', badge: '25% خصم', color: Colors.error, expires: 'ينتهي بعد 3 أيام', icon: 'local-offer' },
  { id: 2, title: 'طوابع مضاعفة', desc: 'كل زيارة تحسب بطابعين هذا الأسبوع فقط!', badge: '2X', color: Colors.primary, expires: 'ينتهي غدًا', icon: 'local-cafe' },
  { id: 3, title: 'قهوة الصباح بنصف الثمن', desc: 'قهوة الصباح بين 8-11 بنصف السعر للأعضاء المخلصين', badge: '50% خصم', color: Colors.success, expires: 'أيام الاثنين والثلاثاء', icon: 'coffee' },
];

export default function CustomerOffers() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>العروض الحالية</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {OFFERS.map(offer => (
          <View key={offer.id} style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <View style={[styles.badge, { backgroundColor: offer.color }]}>
                <Text style={styles.badgeText}>{offer.badge}</Text>
              </View>
              <View style={[styles.offerIcon, { backgroundColor: offer.color + '20' }]}>
                <MaterialIcons name={offer.icon as any} size={28} color={offer.color} />
              </View>
            </View>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDesc}>{offer.desc}</Text>
            <View style={styles.offerFooter}>
              <Pressable style={[styles.useBtn, { backgroundColor: offer.color }]} onPress={() => showAlert('', `استخدام عرض: ${offer.title}`)}>
                <Text style={styles.useBtnText}>استخدم الآن</Text>
              </Pressable>
              <View style={styles.expires}>
                <MaterialIcons name="access-time" size={14} color={Colors.textSecondary} />
                <Text style={styles.expiresText}>{offer.expires}</Text>
              </View>
            </View>
          </View>
        ))}
        {OFFERS.length === 0 ? (
          <View style={styles.empty}><MaterialIcons name="local-offer" size={60} color={Colors.gray300} /><Text style={styles.emptyText}>لا توجد عروض حاليًا</Text></View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold, textAlign: 'right' },
  offerCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.medium },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full },
  badgeText: { color: Colors.white, fontSize: 14, ...Fonts.bold },
  offerIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: 20, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 8 },
  offerDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'right', lineHeight: 22, marginBottom: 16 },
  offerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  useBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.lg },
  useBtnText: { color: Colors.white, fontSize: 14, ...Fonts.bold },
  expires: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expiresText: { fontSize: 12, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
});
