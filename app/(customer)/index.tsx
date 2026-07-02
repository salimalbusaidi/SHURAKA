// Powered by OnSpace.AI - Customer Wallet
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Share } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_CUSTOMERS, MOCK_BUSINESSES } from '@/constants/mockData';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';

export default function CustomerWallet() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const customer = MOCK_CUSTOMERS[0];
  const business = MOCK_BUSINESSES[0];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => showAlert('الإعدادات', 'سيتوفر قريبًا')}>
          <MaterialIcons name="settings" size={22} color="rgba(255,255,255,0.7)" />
        </Pressable>
        <Text style={styles.headerTitle}>محفظتي</Text>
        <Pressable onPress={() => logout()}>
          <MaterialIcons name="logout" size={22} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Digital Wallet Card */}
        <View style={styles.cardWrapper}>
          <LinearGradient colors={[business.brand_color, Colors.primaryLight]} style={styles.walletCard}>
            <View style={styles.cardTop}>
              <View style={styles.qr}>
                <MaterialIcons name="qr-code" size={60} color={Colors.white} />
                <Text style={styles.qrId}>#{customer.id.slice(-4).toUpperCase()}</Text>
              </View>
              <View style={styles.cardTopInfo}>
                <Text style={styles.cardBusiness}>{business.business_name}</Text>
                <Text style={styles.cardCustomerName}>{customer.name}</Text>
                <View style={styles.goldTier}>
                  <MaterialIcons name="diamond" size={14} color={Colors.gold} />
                  <Text style={styles.tierText}>{customer.tier}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardStats}>
              <View style={styles.cardStat}><Text style={styles.cardStatVal}>{customer.points}</Text><Text style={styles.cardStatLbl}>نقطة</Text></View>
              <View style={styles.cardStatDiv} />
              <View style={styles.cardStat}><Text style={styles.cardStatVal}>{customer.stamps}/10</Text><Text style={styles.cardStatLbl}>طوابع</Text></View>
              <View style={styles.cardStatDiv} />
              <View style={styles.cardStat}><Text style={styles.cardStatVal}>{customer.total_visits}</Text><Text style={styles.cardStatLbl}>زيارة</Text></View>
            </View>
          </LinearGradient>
        </View>

        {/* Stamp Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>بطاقة الطوابع</Text>
          <View style={styles.stampsCard}>
            <View style={styles.stampsGrid}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={i} style={[styles.stamp, i < customer.stamps && styles.stampActive]}>
                  <MaterialIcons name="local-cafe" size={20} color={i < customer.stamps ? Colors.white : Colors.gray300} />
                </View>
              ))}
            </View>
            <Text style={styles.stampsText}>{10 - customer.stamps} طابع متبقٍ للحصول على قهوة مجانية ☕</Text>
          </View>
        </View>

        {/* Available Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المكافآت المتاحة</Text>
          {customer.stamps >= 9 ? (
            <View style={styles.rewardCard}>
              <View style={styles.rewardIcon}><MaterialIcons name="card-giftcard" size={36} color={Colors.gold} /></View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>قهوة مجانية جاهزة! 🎉</Text>
                <Text style={styles.rewardDesc}>اعرض هذه المحفظة للموظف لاستبدال مكافأتك</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noRewardCard}>
              <MaterialIcons name="card-giftcard" size={32} color={Colors.gray300} />
              <Text style={styles.noRewardText}>لا توجد مكافآت جاهزة بعد</Text>
            </View>
          )}
        </View>

        {/* Wallet Actions */}
        <View style={styles.walletActions}>
          <Pressable style={styles.walletBtn} onPress={() => Share.share({ message: `محفظتي في ${business.business_name}: https://shuraka.app/w/${customer.id}` })}>
            <MaterialIcons name="share" size={22} color={Colors.primary} />
            <Text style={styles.walletBtnText}>مشاركة المحفظة</Text>
          </Pressable>
          <Pressable style={styles.walletBtn} onPress={() => showAlert('قريبًا', 'سيتوفر إضافة Apple Wallet قريبًا')}>
            <MaterialIcons name="apple" size={22} color={Colors.text} />
            <Text style={styles.walletBtnText}>Apple Wallet</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  cardWrapper: { padding: Spacing.md },
  walletCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.large },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  qr: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  qrId: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  cardTopInfo: { flex: 1, alignItems: 'flex-end' },
  cardBusiness: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  cardCustomerName: { color: Colors.white, fontSize: 22, ...Fonts.bold, marginBottom: 8 },
  goldTier: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(201,168,76,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  tierText: { color: Colors.goldLight, fontSize: 12, ...Fonts.bold },
  cardStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: BorderRadius.md, padding: 12 },
  cardStat: { flex: 1, alignItems: 'center' },
  cardStatVal: { color: Colors.white, fontSize: 22, ...Fonts.bold },
  cardStatLbl: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  cardStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 10 },
  stampsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.small, alignItems: 'flex-end' },
  stampsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', marginBottom: 12 },
  stamp: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Colors.gray200, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  stampActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stampsText: { fontSize: 13, color: Colors.textSecondary },
  rewardCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FEF3C7', borderRadius: BorderRadius.xl, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.gold },
  rewardIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 16, ...Fonts.bold, color: Colors.goldDark, textAlign: 'right', marginBottom: 4 },
  rewardDesc: { fontSize: 13, color: Colors.gold, textAlign: 'right' },
  noRewardCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', gap: 8, ...Shadows.small },
  noRewardText: { fontSize: 14, color: Colors.textSecondary },
  walletActions: { flexDirection: 'row', gap: 12, paddingHorizontal: Spacing.md, marginTop: Spacing.sm },
  walletBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.white, padding: 14, borderRadius: BorderRadius.lg, ...Shadows.small, borderWidth: 1, borderColor: Colors.border },
  walletBtnText: { fontSize: 14, ...Fonts.semiBold, color: Colors.text },
});
