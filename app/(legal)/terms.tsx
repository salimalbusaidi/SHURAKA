// Powered by OnSpace.AI - Terms of Service (Arabic, RTL)
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function TermsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    { title: '١. القبول بالشروط', content: 'باستخدام تطبيق شركاء، فإنك توافق على هذه الشروط والأحكام بالكامل. إذا كنت لا توافق، يُرجى التوقف عن استخدام التطبيق.' },
    { title: '٢. وصف الخدمة', content: 'شركاء هو تطبيق SaaS لإدارة برامج الولاء والمحافظ الرقمية. يوفر أدوات لإدارة العملاء والنقاط والطوابع والمكافآت.' },
    { title: '٣. الاشتراك والدفع', content: 'الاشتراكات تُجدَّد تلقائيًا شهريًا. يمكن إلغاء الاشتراك في أي وقت. لا يوجد استرداد للفترات المدفوعة المنتهية. الأسعار: انطلاقة ٨ ر.ع، نمو ١٨ ر.ع، شركاء بلس ٣٩ ر.ع.' },
    { title: '٤. استخدام المقبول', content: 'يُمنع استخدام التطبيق لأغراض غير قانونية، أو لإرسال محتوى مسيء، أو لانتهاك خصوصية الآخرين، أو لمحاولة اختراق النظام.' },
    { title: '٥. الملكية الفكرية', content: 'جميع محتويات التطبيق، بما في ذلك الكود والتصميم والعلامة التجارية، مملوكة لشركاء ومحمية بموجب قوانين الملكية الفكرية.' },
    { title: '٦. المسؤولية', content: 'نسعى لتقديم خدمة موثوقة، لكننا لا نتحمل المسؤولية عن أي خسائر ناتجة عن انقطاع الخدمة أو أخطاء البيانات.' },
    { title: '٧. التعديلات', content: 'نحتفظ بحق تعديل هذه الشروط في أي وقت مع إشعار مسبق للمستخدمين عبر البريد الإلكتروني.' },
    { title: '٨. القانون الواجب التطبيق', content: 'تخضع هذه الشروط لقوانين سلطنة عُمان، وأي نزاعات تُحسم عبر المحاكم المختصة في مسقط.' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>الشروط والأحكام</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <MaterialIcons name="gavel" size={32} color={Colors.primary} />
          <Text style={styles.introTitle}>شروط وأحكام الاستخدام</Text>
          <Text style={styles.introDate}>آخر تحديث: يوليو ٢٠٢٦</Text>
        </View>
        {sections.map((sec, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            <Text style={styles.sectionContent}>{sec.content}</Text>
          </View>
        ))}
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 18, ...Fonts.bold },
  content: { padding: Spacing.md },
  introCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', gap: 8, marginBottom: Spacing.lg, ...Shadows.small },
  introTitle: { fontSize: 20, ...Fonts.bold, color: Colors.text },
  introDate: { fontSize: 12, color: Colors.textLight },
  section: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 10, ...Shadows.small },
  sectionTitle: { fontSize: 16, ...Fonts.bold, color: Colors.primary, textAlign: 'right', marginBottom: 8 },
  sectionContent: { fontSize: 14, color: Colors.textSecondary, lineHeight: 24, textAlign: 'right' },
});
