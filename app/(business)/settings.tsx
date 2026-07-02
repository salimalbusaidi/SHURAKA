// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { useAlert } from '@/template';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { business, updateBusiness } = useBusiness();
  const { showAlert } = useAlert();
  const [form, setForm] = useState({
    business_name: business?.business_name || '',
    phone: business?.phone || '',
    address: business?.address || '',
    category: business?.category || '',
  });

  const colorOptions = ['#0D1F3C', '#C9A84C', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#3B82F6', '#EC4899'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()}><MaterialIcons name="arrow-forward" size={24} color={Colors.white} /></Pressable>
        <Text style={styles.headerTitle}>إعدادات النشاط</Text>
        <Pressable onPress={() => { updateBusiness(form); showAlert('تم الحفظ', 'تم حفظ التغييرات بنجاح'); }}>
          <Text style={styles.saveText}>حفظ</Text>
        </Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Pressable style={styles.uploadLogoBtn} onPress={() => showAlert('', 'رفع شعار النشاط')}>
            <MaterialIcons name="add-a-photo" size={28} color={Colors.textSecondary} />
            <Text style={styles.uploadLogoText}>رفع الشعار</Text>
            <Text style={styles.uploadLogoHint}>PNG, JPG - حتى 5MB</Text>
          </Pressable>
          <View style={styles.logoPreview}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>{form.business_name?.charAt(0) || 'ش'}</Text>
            </View>
            <Text style={styles.logoName}>{form.business_name || 'اسم النشاط'}</Text>
          </View>
        </View>

        {/* Fields */}
        {[
          { key: 'business_name', label: 'اسم النشاط التجاري', icon: 'store' },
          { key: 'phone', label: 'رقم الهاتف', icon: 'phone' },
          { key: 'address', label: 'العنوان', icon: 'location-on' },
          { key: 'category', label: 'نوع النشاط', icon: 'category' },
        ].map(field => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <View style={styles.fieldBox}>
              <MaterialIcons name={field.icon as any} size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.fieldInput}
                value={form[field.key as keyof typeof form]}
                onChangeText={v => setForm(p => ({ ...p, [field.key]: v }))}
                textAlign="right"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>
        ))}

        {/* Brand Color */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>لون الهوية</Text>
          <View style={styles.colorsRow}>
            {colorOptions.map(color => (
              <Pressable key={color} style={[styles.colorBtn, { backgroundColor: color }, business?.brand_color === color && styles.colorBtnActive]} onPress={() => updateBusiness({ brand_color: color })}>
                {business?.brand_color === color ? <MaterialIcons name="check" size={14} color={Colors.white} /> : null}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Working Hours */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>أوقات العمل</Text>
          <View style={styles.hoursCard}>
            {['السبت - الخميس', 'الجمعة'].map((day, i) => (
              <View key={i} style={[styles.hourRow, i > 0 && styles.hourBorder]}>
                <Text style={styles.hourTime}>{i === 0 ? '٨:٠٠ ص - ١٠:٠٠ م' : '٢:٠٠ م - ١٠:٠٠ م'}</Text>
                <Text style={styles.hourDay}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable style={styles.saveBtn} onPress={() => { updateBusiness(form); showAlert('تم الحفظ', 'تم حفظ جميع التغييرات'); }}>
          <MaterialIcons name="save" size={20} color={Colors.white} />
          <Text style={styles.saveBtnText}>حفظ التغييرات</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  saveText: { color: Colors.goldLight, fontSize: 16, ...Fonts.bold },
  logoSection: { flexDirection: 'row', gap: 16, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.small, alignItems: 'center' },
  uploadLogoBtn: { flex: 1, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', gap: 8 },
  uploadLogoText: { fontSize: 14, ...Fonts.semiBold, color: Colors.textSecondary },
  uploadLogoHint: { fontSize: 11, color: Colors.textLight },
  logoPreview: { alignItems: 'center', gap: 8 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: Colors.white, fontSize: 28, ...Fonts.bold },
  logoName: { fontSize: 13, ...Fonts.medium, color: Colors.text, textAlign: 'center', maxWidth: 80 },
  fieldGroup: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 8 },
  fieldBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, height: 52, gap: 10, ...Shadows.small },
  fieldInput: { flex: 1, fontSize: 15, color: Colors.text },
  colorsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', ...Shadows.small },
  colorBtnActive: { borderWidth: 3, borderColor: Colors.white },
  hoursCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, ...Shadows.small, overflow: 'hidden' },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  hourBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  hourDay: { fontSize: 14, ...Fonts.semiBold, color: Colors.text },
  hourTime: { fontSize: 14, color: Colors.textSecondary },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, marginTop: 8, ...Shadows.medium },
  saveBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
});
