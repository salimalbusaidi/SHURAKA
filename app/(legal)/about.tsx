// Powered by OnSpace.AI - About / App Info Screen
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const InfoRow = ({ icon, label, value, onPress }: { icon: string; label: string; value: string; onPress?: () => void }) => (
  <Pressable
    style={styles.infoRow}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={[styles.infoIcon, onPress && { backgroundColor: Colors.primary + '15' }]}>
      <MaterialIcons name={icon as any} size={20} color={onPress ? Colors.primary : Colors.textSecondary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, onPress && { color: Colors.primary }]}>{value}</Text>
    </View>
    {onPress ? <MaterialIcons name="arrow-back-ios" size={14} color={Colors.textLight} /> : null}
  </Pressable>
);

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <View style={styles.logoArea}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.appName}>شركاء</Text>
          <Text style={styles.appTagline}>محفظة الولاء الذكية لأصحاب الأعمال</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>الإصدار 1.0.0</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Description */}
        <View style={styles.descCard}>
          <Text style={styles.descText}>
            شركاء هو تطبيق ولاء رقمي متكامل يمكّن أصحاب الأعمال من بناء علاقات ولاء أقوى
            مع عملائهم من خلال برامج الطوابع والنقاط والمكافآت والمحافظ الذكية.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المميزات الرئيسية</Text>
          {[
            { icon: 'loyalty', label: 'برامج ولاء متعددة (طوابع، نقاط، كوبونات)' },
            { icon: 'qr-code', label: 'QR Code لكل عميل' },
            { icon: 'account-balance-wallet', label: 'محفظة ذكية رقمية' },
            { icon: 'people', label: 'إدارة العملاء والموظفين والفروع' },
            { icon: 'bar-chart', label: 'تقارير وإحصائيات متقدمة' },
            { icon: 'notifications', label: 'إشعارات وعروض مخصصة' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <MaterialIcons name={f.icon as any} size={18} color={Colors.gold} />
              <Text style={styles.featureText}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الدعم والمعلومات</Text>
          <InfoRow
            icon="privacy-tip"
            label="سياسة الخصوصية"
            value="اقرأ سياسة الخصوصية"
            onPress={() => router.push('/(legal)/privacy-policy' as any)}
          />
          <InfoRow
            icon="description"
            label="شروط الاستخدام"
            value="اقرأ شروط الاستخدام"
            onPress={() => Linking.openURL('https://www.shuraka.app/terms')}
          />
          <InfoRow
            icon="email"
            label="تواصل معنا"
            value="support@shuraka.app"
            onPress={() => Linking.openURL('mailto:support@shuraka.app')}
          />
          <InfoRow
            icon="language"
            label="الموقع الإلكتروني"
            value="www.shuraka.app"
            onPress={() => Linking.openURL('https://www.shuraka.app')}
          />
        </View>

        {/* Technical Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات تقنية</Text>
          <InfoRow icon="info" label="الإصدار" value="1.0.0 (Build 1)" />
          <InfoRow icon="android" label="Package" value="com.shuraka.loyalty" />
          <InfoRow icon="security" label="التشفير" value="TLS 1.3 + AES-256" />
          <InfoRow icon="storage" label="قاعدة البيانات" value="OnSpace Cloud (PostgreSQL)" />
        </View>

        {/* Copyright */}
        <View style={styles.copyrightBox}>
          <Text style={styles.copyright}>© ٢٠٢٥ شركاء للحلول الرقمية</Text>
          <Text style={styles.copyright}>جميع الحقوق محفوظة</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 32 },
  backBtn: { alignSelf: 'flex-end', marginBottom: 8 },
  logoArea: { alignItems: 'center', gap: 8 },
  logo: { width: 80, height: 80, borderRadius: 20, ...Shadows.gold },
  appName: { color: Colors.white, fontSize: 28, ...Fonts.bold, textAlign: 'center' },
  appTagline: { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center' },
  versionBadge: {
    backgroundColor: 'rgba(201,168,76,0.25)',
    paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: BorderRadius.full, marginTop: 4,
  },
  versionText: { color: Colors.goldLight, fontSize: 12, ...Fonts.semiBold },
  content: { padding: Spacing.md, gap: Spacing.md },
  descCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, ...Shadows.small,
  },
  descText: {
    fontSize: 14, color: Colors.textSecondary,
    lineHeight: 24, textAlign: 'right',
  },
  section: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, ...Shadows.small,
  },
  sectionTitle: {
    fontSize: 15, ...Fonts.bold, color: Colors.primary,
    textAlign: 'right', marginBottom: Spacing.sm,
    borderBottomWidth: 1.5, borderBottomColor: Colors.gold,
    paddingBottom: 8,
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingVertical: 6,
  },
  featureText: { flex: 1, fontSize: 14, color: Colors.text, textAlign: 'right' },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm, gap: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { flex: 1, alignItems: 'flex-end' },
  infoLabel: { fontSize: 12, color: Colors.textLight, marginBottom: 2 },
  infoValue: { fontSize: 14, color: Colors.text, ...Fonts.semiBold, textAlign: 'right' },
  copyrightBox: { alignItems: 'center', paddingVertical: Spacing.md, gap: 4 },
  copyright: { fontSize: 12, color: Colors.textLight, textAlign: 'center' },
});
