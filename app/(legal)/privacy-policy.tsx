// Powered by OnSpace.AI - Privacy Policy (Arabic, RTL)
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const sections = [
  {
    title: '١. البيانات التي نجمعها',
    content: `نجمع البيانات التالية عند استخدام تطبيق شركاء:
• الاسم الكامل
• البريد الإلكتروني
• رقم الهاتف
• بيانات النشاط التجاري (الاسم، العنوان، الفئة)
• بيانات الاستخدام داخل التطبيق
• بيانات مرتبطة بالمكافآت والنقاط والطوابع
• بيانات الموقع (فقط عند استخدام ميزة الفروع أو التنبيهات الجغرافية)`
  },
  {
    title: '٢. سبب جمع البيانات',
    content: `نستخدم بياناتك للأغراض التالية:
• إنشاء الحساب وإدارته
• إدارة برنامج الولاء الخاص بك
• تحسين تجربة المستخدم
• إرسال الإشعارات والعروض الترويجية
• إدارة الاشتراكات والمدفوعات
• حماية الحسابات ومنع الاحتيال
• الامتثال للمتطلبات القانونية`
  },
  {
    title: '٣. طريقة استخدام البيانات',
    content: `تُستخدم بياناتك بشكل آمن ومسؤول:
• تخزين آمن على خوادم مشفرة
• عدم بيع بياناتك لأطراف ثالثة
• مشاركة محدودة مع مزودي الخدمات المعتمدين فقط
• الاحتفاظ بالبيانات طوال فترة استخدامك للتطبيق`
  },
  {
    title: '٤. مشاركة البيانات مع خدمات خارجية',
    content: `قد نشارك بعض بياناتك مع:
• Stripe: لمعالجة المدفوعات والاشتراكات بشكل آمن
• Supabase: لتخزين البيانات وإدارة الحسابات
• خدمات البريد الإلكتروني: لإرسال رموز التحقق والإشعارات

جميع هذه الخدمات تلتزم بمعايير حماية البيانات الدولية.`
  },
  {
    title: '٥. حماية البيانات',
    content: `نطبق أعلى معايير الأمان لحماية بياناتك:
• تشفير البيانات أثناء النقل والتخزين (TLS/SSL)
• سياسات Row Level Security في قاعدة البيانات
• مصادقة ثنائية عبر رموز OTP
• مراقبة مستمرة للأمان
• تقييد وصول الموظفين للبيانات الضرورية فقط`
  },
  {
    title: '٦. حقوق المستخدم',
    content: `لديك الحق في:
• الوصول إلى بياناتك الشخصية
• تصحيح أي بيانات غير دقيقة
• طلب حذف حسابك وبياناتك
• سحب موافقتك على استخدام البيانات
• تقديم شكوى لجهة الحماية المختصة

لممارسة هذه الحقوق، تواصل معنا عبر: support@shuraka.app`
  },
  {
    title: '٧. ملفات تعريف الارتباط (Cookies)',
    content: `يستخدم تطبيق الويب ملفات الجلسة (Session Cookies) لحفظ حالة تسجيل الدخول فقط. لا نستخدم cookies للتتبع التسويقي.`
  },
  {
    title: '٨. تعديل سياسة الخصوصية',
    content: `قد نحدّث هذه السياسة من وقت لآخر. سنبلغك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل التطبيق. آخر تحديث: يوليو ٢٠٢٦.`
  },
  {
    title: '٩. التواصل معنا',
    content: `لأي استفسارات حول سياسة الخصوصية:
• البريد: support@shuraka.app
• الهاتف: +968 2456 7890
• العنوان: مسقط، سلطنة عُمان`
  },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>سياسة الخصوصية</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <MaterialIcons name="security" size={32} color={Colors.primary} />
          <Text style={styles.introTitle}>خصوصيتك مهمة لنا</Text>
          <Text style={styles.introText}>
            تطبيق شركاء ملتزم بحماية بياناتك الشخصية واحترام خصوصيتك.
            تشرح هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها.
          </Text>
          <Text style={styles.introDate}>آخر تحديث: يوليو ٢٠٢٦</Text>
        </View>

        {sections.map((sec, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            <Text style={styles.sectionContent}>{sec.content}</Text>
          </View>
        ))}

        <Pressable style={styles.contactBtn} onPress={() => router.push('/(legal)/about' as any)}>
          <MaterialIcons name="contact-support" size={20} color={Colors.white} />
          <Text style={styles.contactBtnText}>تواصل معنا</Text>
        </Pressable>

        <View style={{ height: insets.bottom + 16 }} />
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
  introText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  introDate: { fontSize: 12, color: Colors.textLight },
  section: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 10, ...Shadows.small },
  sectionTitle: { fontSize: 16, ...Fonts.bold, color: Colors.primary, textAlign: 'right', marginBottom: 8 },
  sectionContent: { fontSize: 14, color: Colors.textSecondary, lineHeight: 24, textAlign: 'right' },
  contactBtn: { backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: Spacing.md },
  contactBtnText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
});
