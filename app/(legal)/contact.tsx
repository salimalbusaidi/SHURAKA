// Powered by OnSpace.AI - Contact Us Page
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAlert } from '@/template';

export default function ContactScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const contactMethods = [
    { icon: 'email', label: 'البريد الإلكتروني', value: 'support@shuraka.app', action: () => Linking.openURL('mailto:support@shuraka.app') },
    { icon: 'phone', label: 'الهاتف', value: '+968 2456 7890', action: () => Linking.openURL('tel:+96824567890') },
    { icon: 'chat', label: 'واتساب', value: '+968 9100 0000', action: () => Linking.openURL('https://wa.me/96891000000') },
    { icon: 'location-on', label: 'العنوان', value: 'مسقط، سلطنة عُمان', action: () => {} },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>تواصل معنا</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <MaterialIcons name="support-agent" size={40} color={Colors.primary} />
          <Text style={styles.heroTitle}>نحن هنا للمساعدة</Text>
          <Text style={styles.heroText}>فريق الدعم متاح من السبت إلى الخميس، ٩ صباحًا - ٦ مساءً</Text>
        </View>
        {contactMethods.map((m, i) => (
          <Pressable key={i} style={styles.contactRow} onPress={m.action}>
            <MaterialIcons name="chevron-left" size={20} color={Colors.textLight} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactValue}>{m.value}</Text>
              <Text style={styles.contactLabel}>{m.label}</Text>
            </View>
            <View style={[styles.contactIcon, { backgroundColor: Colors.primary + '15' }]}>
              <MaterialIcons name={m.icon as any} size={24} color={Colors.primary} />
            </View>
          </Pressable>
        ))}
        <Text style={styles.formTitle}>أرسل رسالة</Text>
        <View style={styles.formCard}>
          {[
            { key: 'name', label: 'الاسم', placeholder: 'اسمك الكامل' },
            { key: 'email', label: 'البريد', placeholder: 'بريدك الإلكتروني' },
          ].map(f => (
            <View key={f.key} style={styles.field}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <TextInput style={styles.fieldInput} placeholder={f.placeholder} value={form[f.key as keyof typeof form]} onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))} textAlign="right" placeholderTextColor={Colors.textLight} />
            </View>
          ))}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>الرسالة</Text>
            <TextInput style={[styles.fieldInput, styles.fieldTextarea]} placeholder="كيف يمكننا مساعدتك؟" value={form.message} onChangeText={v => setForm(p => ({ ...p, message: v }))} multiline textAlign="right" placeholderTextColor={Colors.textLight} />
          </View>
          <Pressable style={styles.sendBtn} onPress={() => { showAlert('تم الإرسال', 'سنتواصل معك خلال ٢٤ ساعة'); setForm({ name: '', email: '', message: '' }); }}>
            <MaterialIcons name="send" size={18} color={Colors.white} />
            <Text style={styles.sendBtnText}>إرسال</Text>
          </Pressable>
        </View>
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
  heroCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', gap: 10, marginBottom: Spacing.lg, ...Shadows.small },
  heroTitle: { fontSize: 20, ...Fonts.bold, color: Colors.text },
  heroText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  contactRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 8, ...Shadows.small, gap: 12 },
  contactIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  contactValue: { fontSize: 15, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  formTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginTop: Spacing.md, marginBottom: 10 },
  formCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.small },
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 6 },
  fieldInput: { backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text },
  fieldTextarea: { height: 100, textAlignVertical: 'top' },
  sendBtn: { backgroundColor: Colors.primary, height: 50, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  sendBtnText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
});
