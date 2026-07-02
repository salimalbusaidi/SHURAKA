// Powered by OnSpace.AI - Public Web Wallet (accessible via URL without login)
// Route: /wallet/[id]  →  shuraka.app/wallet/CUSTOMER_ID
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Share, Linking, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { MOCK_CUSTOMERS, MOCK_BUSINESSES, MOCK_TRANSACTIONS } from '@/constants/mockData';
import { useAlert } from '@/template';
import { useResponsive } from '@/hooks/useResponsive';

// Wallet pass URL builders — replace with real endpoints when ready
function buildApplePassUrl(customerId: string): string | null {
  const ep = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_APPLE_WALLET_ENDPOINT) || null;
  return ep ? `${ep}/pass/${customerId}` : null;
}
function buildGooglePassUrl(customerId: string): string | null {
  const ep = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_GOOGLE_WALLET_ENDPOINT) || null;
  return ep ? `${ep}/google-wallet/${customerId}` : null;
}

export default function PublicWalletScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { isDesktop, isTablet } = useResponsive();
  const isWeb = Platform.OS === 'web';

  const customer = MOCK_CUSTOMERS.find(c => c.id === id) || MOCK_CUSTOMERS[0];
  const business = MOCK_BUSINESSES[0];
  const customerTx = MOCK_TRANSACTIONS.filter(t => t.customer_name === customer?.name);
  const walletUrl = isWeb
    ? (typeof window !== 'undefined' ? window.location.href : `https://shuraka.app/wallet/${id}`)
    : `https://shuraka.app/wallet/${id}`;

  const tierGradients: Record<string, [string, string]> = {
    'بلاتيني': ['#7C3AED', '#A855F7'],
    'ذهبي': [Colors.gold, Colors.goldDark],
    'فضي': ['#6B7280', '#9CA3AF'],
    'برونزي': ['#B45309', '#D97706'],
  };

  const gradient = tierGradients[customer?.tier] || [Colors.primary, Colors.primaryLight];

  const handleCopy = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      try { await navigator.clipboard.writeText(walletUrl); showAlert('تم النسخ', 'تم نسخ رابط المحفظة'); return; } catch (_) {}
    }
    showAlert('رابط المحفظة', walletUrl);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `محفظة ${customer?.name}: ${walletUrl}`, url: walletUrl });
    } catch (_) {}
  };

  const handleAppleWallet = async () => {
    const url = buildApplePassUrl(customer?.id || '');
    if (!url) {
      showAlert('Apple Wallet', 'هذه الميزة ستتوفر قريبًا بعد ربط Apple Developer Account وشهادة PKI.', [
        { text: 'مشاركة الرابط', onPress: handleShare },
        { text: 'إغلاق', style: 'cancel' },
      ]);
      return;
    }
    Linking.openURL(url).catch(() => showAlert('خطأ', 'تعذر فتح Apple Wallet'));
  };

  const handleGoogleWallet = async () => {
    const url = buildGooglePassUrl(customer?.id || '');
    if (!url) {
      showAlert('Google Wallet', 'هذه الميزة ستتوفر قريبًا بعد ربط Google Wallet Issuer ID.', [
        { text: 'مشاركة الرابط', onPress: handleShare },
        { text: 'إغلاق', style: 'cancel' },
      ]);
      return;
    }
    Linking.openURL(url).catch(() => showAlert('خطأ', 'تعذر فتح Google Wallet'));
  };

  const maxWidth = isDesktop ? 520 : '100%';

  return (
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWeb && { alignItems: 'center' },
          { paddingBottom: insets.bottom + 32 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isWeb && { maxWidth, width: '100%' }]}>
          {/* Digital Loyalty Card */}
          <LinearGradient colors={gradient as [string, string]} style={styles.loyaltyCard}>
            {/* Business Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardQR}>
                <MaterialIcons name="qr-code-2" size={56} color="rgba(255,255,255,0.9)" />
                <Text style={styles.cardQRId}>#{(customer?.id || '').slice(-6).toUpperCase()}</Text>
              </View>
              <View style={styles.cardHeaderInfo}>
                <View style={styles.businessLogoPlaceholder}>
                  <Text style={styles.businessLogoText}>{business?.business_name.charAt(0)}</Text>
                </View>
                <Text style={styles.cardBusinessName}>{business?.business_name}</Text>
                <Text style={styles.cardCustomerName}>{customer?.name}</Text>
                <View style={styles.tierBadge}>
                  <MaterialIcons name="diamond" size={12} color={Colors.white} />
                  <Text style={styles.tierText}>{customer?.tier}</Text>
                </View>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.cardStats}>
              <View style={styles.cardStat}>
                <Text style={styles.cardStatVal}>{customer?.points}</Text>
                <Text style={styles.cardStatLbl}>نقطة</Text>
              </View>
              <View style={styles.cardStatDiv} />
              <View style={styles.cardStat}>
                <Text style={styles.cardStatVal}>{customer?.stamps}/10</Text>
                <Text style={styles.cardStatLbl}>طوابع</Text>
              </View>
              <View style={styles.cardStatDiv} />
              <View style={styles.cardStat}>
                <Text style={styles.cardStatVal}>{customer?.total_visits}</Text>
                <Text style={styles.cardStatLbl}>زيارة</Text>
              </View>
            </View>

            {/* Branding Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterPowered}>Powered by شركاء</Text>
              <Text style={styles.cardFooterDate}>عضو منذ {customer?.joined}</Text>
            </View>
          </LinearGradient>

          {/* Wallet Pass Buttons */}
          <View style={styles.passRow}>
            <Pressable style={[styles.passBtn, styles.appleBtn]} onPress={handleAppleWallet}>
              <MaterialIcons name="phone-iphone" size={18} color={Colors.white} />
              <Text style={styles.passBtnText}>Apple Wallet</Text>
            </Pressable>
            <Pressable style={[styles.passBtn, styles.googleBtn]} onPress={handleGoogleWallet}>
              <MaterialIcons name="account-balance-wallet" size={18} color={Colors.white} />
              <Text style={styles.passBtnText}>Google Wallet</Text>
            </Pressable>
          </View>

          {/* Share Row */}
          <View style={styles.shareSection}>
            <View style={styles.linkRow}>
              <MaterialIcons name="link" size={16} color={Colors.textSecondary} />
              <Text style={styles.linkText} numberOfLines={1}>{walletUrl}</Text>
            </View>
            <View style={styles.shareButtons}>
              <Pressable style={styles.shareBtn} onPress={handleCopy}>
                <MaterialIcons name="content-copy" size={18} color={Colors.primary} />
                <Text style={styles.shareBtnText}>نسخ الرابط</Text>
              </Pressable>
              <Pressable style={[styles.shareBtn, styles.shareBtnFull]} onPress={handleShare}>
                <MaterialIcons name="share" size={18} color={Colors.white} />
                <Text style={[styles.shareBtnText, { color: Colors.white }]}>مشاركة</Text>
              </Pressable>
            </View>
          </View>

          {/* Stamps Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>بطاقة الطوابع</Text>
            <View style={styles.stampsCard}>
              <View style={styles.stampsGrid}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <View key={i} style={[styles.stamp, i < (customer?.stamps || 0) && styles.stampFilled]}>
                    <MaterialIcons name="local-cafe" size={16} color={i < (customer?.stamps || 0) ? Colors.white : Colors.gray300} />
                  </View>
                ))}
              </View>
              <Text style={styles.stampsProgress}>
                {customer?.stamps} / 10 · متبقي {10 - (customer?.stamps || 0)} للمكافأة
              </Text>
            </View>
          </View>

          {/* Transactions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>آخر العمليات</Text>
            {customerTx.length > 0 ? customerTx.slice(0, 5).map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <Text style={styles.txTime}>{tx.time}</Text>
                <View style={styles.txInfo}>
                  <Text style={styles.txValue}>{tx.value}</Text>
                  <Text style={styles.txBranch}>{tx.branch}</Text>
                </View>
                <View style={[styles.txIcon, {
                  backgroundColor: tx.type === 'stamp' ? '#EEF2FF' : tx.type === 'points' ? '#FEF3C7' : Colors.successLight
                }]}>
                  <MaterialIcons
                    name={tx.type === 'stamp' ? 'local-cafe' : tx.type === 'points' ? 'star' : 'card-giftcard'}
                    size={18}
                    color={tx.type === 'stamp' ? Colors.primary : tx.type === 'points' ? Colors.gold : Colors.success}
                  />
                </View>
              </View>
            )) : (
              <Text style={styles.emptyText}>لا توجد عمليات حتى الآن</Text>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>محفظة رقمية مدعومة بـ</Text>
            <Text style={styles.footerBrand}>شركاء — منصة الولاء الذكية</Text>
            <Text style={styles.footerSub}>shuraka.app</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  containerWeb: { backgroundColor: Colors.gray100 } as any,
  scrollContent: { flexGrow: 1 },
  card: { padding: Spacing.md },
  loyaltyCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: 12, ...Shadows.large },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardQR: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.md, padding: 10, width: 88, height: 88, justifyContent: 'center' },
  cardQRId: { color: 'rgba(255,255,255,0.6)', fontSize: 10, ...Fonts.semiBold },
  cardHeaderInfo: { flex: 1, alignItems: 'flex-end', paddingLeft: 12 },
  businessLogoPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  businessLogoText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  cardBusinessName: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  cardCustomerName: { color: Colors.white, fontSize: 22, ...Fonts.bold, marginBottom: 8 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.full },
  tierText: { color: Colors.white, fontSize: 12, ...Fonts.bold },
  cardStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: BorderRadius.md, padding: 14, marginBottom: 14 },
  cardStat: { flex: 1, alignItems: 'center' },
  cardStatVal: { color: Colors.white, fontSize: 24, ...Fonts.bold },
  cardStatLbl: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  cardStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooterPowered: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  cardFooterDate: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  passRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  passBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: BorderRadius.lg },
  appleBtn: { backgroundColor: '#1C1C1E' },
  googleBtn: { backgroundColor: '#1A73E8' },
  passBtnText: { color: Colors.white, fontSize: 13, ...Fonts.semiBold },
  shareSection: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, ...Shadows.small, marginBottom: 12, gap: 10 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, padding: 10 },
  linkText: { flex: 1, fontSize: 12, color: Colors.textSecondary },
  shareButtons: { flexDirection: 'row', gap: 10 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.primary },
  shareBtnFull: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  shareBtnText: { fontSize: 13, ...Fonts.semiBold, color: Colors.primary },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 8 },
  stampsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, ...Shadows.small, alignItems: 'flex-end' },
  stampsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', marginBottom: 8 },
  stamp: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.gray200, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  stampFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stampsProgress: { fontSize: 12, color: Colors.textSecondary },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 8, ...Shadows.small, gap: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txValue: { fontSize: 14, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  txBranch: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  txTime: { fontSize: 11, color: Colors.textLight },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingVertical: 20 },
  footer: { alignItems: 'center', paddingVertical: Spacing.lg, gap: 4 },
  footerText: { fontSize: 12, color: Colors.textLight },
  footerBrand: { fontSize: 15, ...Fonts.bold, color: Colors.primary },
  footerSub: { fontSize: 12, color: Colors.textLight },
});
