// Powered by OnSpace.AI - Customer Wallet with Digital Pass Integration
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Share, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { useAlert } from '@/template';

// ── Apple / Google Wallet integration helpers ─────────────────
// These are Placeholder implementations ready for real integration.
// To activate Apple Wallet: Set APPLE_WALLET_PASS_TYPE_ID, TEAM_ID, and certificates.
// To activate Google Wallet: Set GOOGLE_WALLET_ISSUER_ID, CLASS_ID, and service account.

function buildAppleWalletPassUrl(customerId: string, businessName: string): string | null {
  // TODO: Replace with your actual Apple Wallet Pass API endpoint
  // The endpoint should: generate a .pkpass file and return a download URL
  // Required: Pass Type Identifier, Team Identifier, Certificate, Private Key
  const endpoint = process.env.EXPO_PUBLIC_APPLE_WALLET_ENDPOINT;
  if (!endpoint) return null;
  return `${endpoint}/pass/${customerId}`;
}

function buildGoogleWalletJwtUrl(customerId: string, businessId: string): string | null {
  // TODO: Replace with your actual Google Wallet JWT generation endpoint
  // The endpoint should: create a Google Wallet Object and return a Save URL
  // Required: Issuer ID, Class ID, Service Account Credentials
  const endpoint = process.env.EXPO_PUBLIC_GOOGLE_WALLET_ENDPOINT;
  if (!endpoint) return null;
  return `${endpoint}/google-wallet/${customerId}?business=${businessId}`;
}

export default function CustomerWalletScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { customers, business, transactions, addStamp, addPoints } = useBusiness();
  const { showAlert } = useAlert();

  const customer = customers.find(c => c.id === id) || customers[0];
  const customerTx = transactions.filter(t => t.customer_name === customer?.name);
  const [addingToApple, setAddingToApple] = useState(false);
  const [addingToGoogle, setAddingToGoogle] = useState(false);

  const tierColors: Record<string, string> = {
    'بلاتيني': '#8B5CF6',
    'ذهبي': Colors.gold,
    'فضي': '#6B7280',
    'برونزي': '#B45309',
  };

  const walletUrl = `https://shuraka.app/wallet/${id}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `محفظة ${customer?.name} في ${business?.business_name}: ${walletUrl}`,
        url: walletUrl,
      });
    } catch {}
  };

  const handleCopyLink = () => {
    showAlert('تم النسخ', 'تم نسخ رابط المحفظة بنجاح');
  };

  // ── Apple Wallet ──────────────────────────────────────────────
  const handleAppleWallet = async () => {
    if (!customer) return;
    setAddingToApple(true);

    const passUrl = buildAppleWalletPassUrl(customer.id, business?.business_name || '');

    if (!passUrl) {
      // Show integration guide
      showAlert(
        'إضافة إلى Apple Wallet',
        'هذه الميزة ستكون متاحة قريبًا. يتطلب التكامل الكامل:\n\n• Apple Developer Account\n• Pass Type Identifier\n• شهادة PKI\n\nبدلاً من ذلك، يمكنك مشاركة رابط المحفظة.',
        [
          { text: 'مشاركة الرابط', onPress: handleShare },
          { text: 'إغلاق', style: 'cancel' },
        ]
      );
      setAddingToApple(false);
      return;
    }

    try {
      await Linking.openURL(passUrl);
    } catch {
      showAlert('خطأ', 'تعذر فتح Apple Wallet. تأكد من تثبيت التطبيق.');
    }
    setAddingToApple(false);
  };

  // ── Google Wallet ─────────────────────────────────────────────
  const handleGoogleWallet = async () => {
    if (!customer) return;
    setAddingToGoogle(true);

    const saveUrl = buildGoogleWalletJwtUrl(customer.id, business?.id || '');

    if (!saveUrl) {
      showAlert(
        'إضافة إلى Google Wallet',
        'هذه الميزة ستكون متاحة قريبًا. يتطلب التكامل الكامل:\n\n• Google Wallet Issuer ID\n• Class ID وObject ID\n• Service Account Credentials\n\nبدلاً من ذلك، يمكنك مشاركة رابط المحفظة.',
        [
          { text: 'مشاركة الرابط', onPress: handleShare },
          { text: 'إغلاق', style: 'cancel' },
        ]
      );
      setAddingToGoogle(false);
      return;
    }

    try {
      await Linking.openURL(saveUrl);
    } catch {
      showAlert('خطأ', 'تعذر فتح Google Wallet.');
    }
    setAddingToGoogle(false);
  };

  if (!customer) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerBtn} onPress={handleShare}>
              <MaterialIcons name="share" size={22} color={Colors.white} />
            </Pressable>
            <Pressable style={styles.headerBtn} onPress={() => showAlert('', 'إرسال عرض خاص لـ ' + customer.name)}>
              <MaterialIcons name="local-offer" size={22} color={Colors.white} />
            </Pressable>
          </View>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-forward" size={26} color={Colors.white} />
          </Pressable>
        </View>

        {/* Digital Loyalty Card */}
        <View style={styles.digitalCard}>
          <LinearGradient
            colors={[business?.brand_color || Colors.primary, Colors.primaryLight]}
            style={styles.cardGradient}
          >
            <View style={styles.cardTop}>
              {/* QR Placeholder */}
              <View style={styles.qrPlaceholder}>
                <MaterialIcons name="qr-code-2" size={52} color="rgba(255,255,255,0.9)" />
                <Text style={styles.qrId}>#{customer.id.slice(-4).toUpperCase()}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardBusiness}>{business?.business_name}</Text>
                <Text style={styles.cardCustomer}>{customer.name}</Text>
                <View style={[styles.tierBadge, { backgroundColor: tierColors[customer.tier] || Colors.gold }]}>
                  <MaterialIcons name="diamond" size={12} color={Colors.white} />
                  <Text style={styles.tierText}>{customer.tier}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardStats}>
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>{customer.points}</Text>
                <Text style={styles.cardStatLabel}>نقطة</Text>
              </View>
              <View style={styles.cardStatDiv} />
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>{customer.stamps}/10</Text>
                <Text style={styles.cardStatLabel}>طوابع</Text>
              </View>
              <View style={styles.cardStatDiv} />
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>{customer.total_visits}</Text>
                <Text style={styles.cardStatLabel}>زيارة</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Digital Wallet Buttons */}
        <View style={styles.walletPassRow}>
          <Pressable
            style={[styles.walletPassBtn, styles.appleBtn]}
            onPress={handleAppleWallet}
            disabled={addingToApple}
          >
            <MaterialIcons name="phone-iphone" size={18} color={Colors.white} />
            <Text style={styles.walletPassText}>Apple Wallet</Text>
          </Pressable>
          <Pressable
            style={[styles.walletPassBtn, styles.googleBtn]}
            onPress={handleGoogleWallet}
            disabled={addingToGoogle}
          >
            <MaterialIcons name="account-balance-wallet" size={18} color={Colors.white} />
            <Text style={styles.walletPassText}>Google Wallet</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { icon: 'local-cafe', label: 'طابع', color: Colors.primary, onPress: () => { addStamp(customer.id); showAlert('تم', 'تمت إضافة طابع'); } },
            { icon: 'star', label: 'نقاط', color: Colors.gold, onPress: () => { addPoints(customer.id, 50); showAlert('تم', 'تمت إضافة 50 نقطة'); } },
            { icon: 'card-giftcard', label: 'مكافأة', color: Colors.success, onPress: () => showAlert('', 'استبدال المكافأة') },
            { icon: 'edit', label: 'تعديل', color: Colors.info, onPress: () => showAlert('', 'تعديل بيانات العميل') },
          ].map((a, i) => (
            <Pressable key={i} style={styles.quickAction} onPress={a.onPress}>
              <View style={[styles.qaIcon, { backgroundColor: a.color + '20' }]}>
                <MaterialIcons name={a.icon as any} size={24} color={a.color} />
              </View>
              <Text style={styles.qaLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Stamps Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>بطاقة الطوابع</Text>
          <View style={styles.stampsCard}>
            <View style={styles.stampsGrid}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={i} style={[styles.stamp, i < customer.stamps && styles.stampFilled]}>
                  <MaterialIcons
                    name="local-cafe"
                    size={18}
                    color={i < customer.stamps ? Colors.white : Colors.gray300}
                  />
                  {i === 9 ? (
                    <View style={styles.rewardMark}>
                      <MaterialIcons name="card-giftcard" size={10} color={Colors.gold} />
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
            <Text style={styles.stampsProgress}>
              {customer.stamps} / 10 طوابع · {10 - customer.stamps} متبقي للمكافأة
            </Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>بيانات العميل</Text>
          <View style={styles.detailsCard}>
            {[
              { icon: 'person', label: 'الاسم', value: customer.name },
              { icon: 'phone', label: 'الهاتف', value: customer.phone },
              { icon: 'email', label: 'البريد', value: customer.email || 'غير مضاف' },
              { icon: 'cake', label: 'عيد الميلاد', value: customer.birthday || 'غير محدد' },
              { icon: 'calendar-today', label: 'تاريخ الانضمام', value: customer.joined },
              { icon: 'access-time', label: 'آخر زيارة', value: customer.last_visit },
            ].map((d, i) => (
              <View key={i} style={[styles.detailRow, i > 0 && styles.detailBorder]}>
                <Text style={styles.detailValue}>{d.value}</Text>
                <View style={styles.detailLabel}>
                  <MaterialIcons name={d.icon as any} size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailLabelText}>{d.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>سجل العمليات</Text>
          {customerTx.length > 0 ? customerTx.map(tx => (
            <View key={tx.id} style={styles.txItem}>
              <View style={[styles.txIcon, {
                backgroundColor: tx.type === 'stamp' ? '#EEF2FF'
                  : tx.type === 'points' ? '#FEF3C7' : Colors.successLight,
              }]}>
                <MaterialIcons
                  name={tx.type === 'stamp' ? 'local-cafe' : tx.type === 'points' ? 'star' : 'card-giftcard'}
                  size={18}
                  color={tx.type === 'stamp' ? Colors.primary : tx.type === 'points' ? Colors.gold : Colors.success}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txValue}>{tx.value}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <Text style={styles.txBranch}>{tx.branch}</Text>
            </View>
          )) : (
            <View style={styles.emptyTx}>
              <MaterialIcons name="history" size={40} color={Colors.gray300} />
              <Text style={styles.emptyTxText}>لا توجد عمليات حتى الآن</Text>
            </View>
          )}
        </View>

        {/* Share / Copy Link */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مشاركة المحفظة</Text>
          <View style={styles.shareCard}>
            <View style={styles.linkBox}>
              <MaterialIcons name="link" size={16} color={Colors.textSecondary} />
              <Text style={styles.linkText} numberOfLines={1}>{walletUrl}</Text>
            </View>
            <View style={styles.shareActions}>
              <Pressable style={styles.shareBtn} onPress={handleCopyLink}>
                <MaterialIcons name="content-copy" size={18} color={Colors.primary} />
                <Text style={styles.shareBtnText}>نسخ الرابط</Text>
              </Pressable>
              <Pressable style={[styles.shareBtn, styles.shareBtnFilled]} onPress={handleShare}>
                <MaterialIcons name="share" size={18} color={Colors.white} />
                <Text style={[styles.shareBtnText, { color: Colors.white }]}>مشاركة</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Digital Wallet Integration Info */}
        <View style={styles.section}>
          <View style={styles.walletInfoCard}>
            <View style={styles.walletInfoHeader}>
              <MaterialIcons name="info-outline" size={20} color={Colors.info} />
              <Text style={styles.walletInfoTitle}>المحافظ الرقمية</Text>
            </View>
            <Text style={styles.walletInfoText}>
              يمكن إضافة بطاقة الولاء إلى Apple Wallet أو Google Wallet عند تفعيل التكامل الكامل.
              البطاقة ستحتوي على QR Code والنقاط والطوابع وتُحدَّث تلقائيًا.
            </Text>
            <View style={styles.walletFeatureList}>
              {[
                'QR Code للعميل',
                'رصيد النقاط والطوابع',
                'المكافآت المتاحة',
                'تحديث تلقائي',
                'إشعارات فورية',
              ].map((f, i) => (
                <View key={i} style={styles.walletFeatureItem}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.success} />
                  <Text style={styles.walletFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  digitalCard: { borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.large, marginBottom: 12 },
  cardGradient: { padding: Spacing.lg },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  qrPlaceholder: { width: 84, height: 84, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  qrId: { color: 'rgba(255,255,255,0.6)', fontSize: 10, ...Fonts.semiBold },
  cardInfo: { flex: 1, alignItems: 'flex-end' },
  cardBusiness: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  cardCustomer: { color: Colors.white, fontSize: 22, ...Fonts.bold, marginBottom: 8 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full },
  tierText: { color: Colors.white, fontSize: 12, ...Fonts.bold },
  cardStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: BorderRadius.md, padding: 12 },
  cardStat: { flex: 1, alignItems: 'center' },
  cardStatValue: { color: Colors.white, fontSize: 22, ...Fonts.bold },
  cardStatLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  cardStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  // Wallet Pass Buttons
  walletPassRow: { flexDirection: 'row', gap: 10 },
  walletPassBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 42, borderRadius: BorderRadius.lg,
  },
  appleBtn: { backgroundColor: '#1C1C1E' },
  googleBtn: { backgroundColor: '#1A73E8' },
  walletPassText: { color: Colors.white, fontSize: 13, ...Fonts.semiBold },
  // Content
  scroll: { flex: 1 },
  quickActions: {
    flexDirection: 'row', backgroundColor: Colors.white,
    marginHorizontal: Spacing.md, marginTop: Spacing.md,
    borderRadius: BorderRadius.xl, padding: Spacing.md,
    ...Shadows.small, justifyContent: 'space-around',
  },
  quickAction: { alignItems: 'center', gap: 6 },
  qaIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: 12, color: Colors.text, ...Fonts.medium },
  section: { padding: Spacing.md, paddingBottom: 0 },
  sectionTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 10 },
  stampsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.small, alignItems: 'flex-end' },
  stampsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', marginBottom: 12 },
  stamp: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Colors.gray200, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  stampFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rewardMark: { position: 'absolute', top: -4, right: -4, backgroundColor: '#FEF3C7', borderRadius: 6, padding: 2 },
  stampsProgress: { fontSize: 13, color: Colors.textSecondary },
  detailsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, ...Shadows.small, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  detailBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  detailLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabelText: { fontSize: 14, color: Colors.textSecondary, ...Fonts.medium },
  detailValue: { fontSize: 14, ...Fonts.semiBold, color: Colors.text },
  txItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 8, ...Shadows.small },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txValue: { fontSize: 14, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  txTime: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  txBranch: { fontSize: 11, color: Colors.textLight },
  emptyTx: { alignItems: 'center', padding: 32, gap: 8, backgroundColor: Colors.white, borderRadius: BorderRadius.xl },
  emptyTxText: { fontSize: 14, color: Colors.textSecondary },
  // Share card
  shareCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, ...Shadows.small, gap: 12 },
  linkBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, padding: Spacing.sm },
  linkText: { flex: 1, fontSize: 12, color: Colors.textSecondary },
  shareActions: { flexDirection: 'row', gap: 10 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.primary },
  shareBtnFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  shareBtnText: { fontSize: 14, ...Fonts.semiBold, color: Colors.primary },
  // Info card
  walletInfoCard: { backgroundColor: Colors.infoLight, borderRadius: BorderRadius.xl, padding: Spacing.md, ...Shadows.small },
  walletInfoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  walletInfoTitle: { fontSize: 15, ...Fonts.bold, color: Colors.info },
  walletInfoText: { fontSize: 13, color: Colors.info, lineHeight: 20, textAlign: 'right', marginBottom: 12 },
  walletFeatureList: { gap: 6 },
  walletFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  walletFeatureText: { fontSize: 13, color: Colors.text, textAlign: 'right' },
});
