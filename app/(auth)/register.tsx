// Powered by OnSpace.AI - Register Screen (sends OTP after signup)
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Pressable, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const { showAlert } = useAlert();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showAlert('بيانات ناقصة', 'يرجى ملء الاسم والبريد الإلكتروني وكلمة المرور');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      showAlert('خطأ', 'صيغة البريد الإلكتروني غير صحيحة');
      return;
    }
    if (form.password.length < 6) {
      showAlert('كلمة المرور قصيرة', 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showAlert('خطأ', 'كلمتا المرور غير متطابقتين');
      return;
    }
    if (!agreed) {
      showAlert('الموافقة مطلوبة', 'يجب الموافقة على الشروط والأحكام للمتابعة');
      return;
    }

    setLoading(true);
    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      role: 'business_owner',
    });
    setLoading(false);

    if (!result.success) {
      showAlert('خطأ في إنشاء الحساب', result.error || 'حدث خطأ، يرجى المحاولة مرة أخرى');
      return;
    }

    if (result.needsVerification) {
      setDone(true);
    } else {
      router.replace('/(onboarding)' as any);
    }
  };

  // ── Success/Verify screen ────────────────────────────────────
  if (done) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.logoArea}>
            <View style={[styles.logoCircle, { backgroundColor: Colors.success }]}>
              <MaterialIcons name="mark-email-read" size={36} color={Colors.white} />
            </View>
            <Text style={styles.logoName}>تم إنشاء حسابك!</Text>
          </View>
        </LinearGradient>
        <View style={styles.verifyContent}>
          <View style={styles.verifyBox}>
            <MaterialIcons name="email" size={52} color={Colors.primary} />
            <Text style={styles.verifyTitle}>تحقق من بريدك الإلكتروني</Text>
            <Text style={styles.verifyText}>
              أرسلنا رسالة تأكيد إلى{'\n'}
              <Text style={styles.emailHighlight}>{form.email}</Text>
            </Text>
            <Text style={styles.verifyNote}>
              انقر على الرابط أو رمز التحقق في الرسالة لتفعيل حسابك وتسجيل الدخول.
            </Text>
            <View style={styles.verifyTip}>
              <MaterialIcons name="info-outline" size={16} color={Colors.info} />
              <Text style={styles.verifyTipText}>إذا لم تجد الرسالة، تحقق من مجلد البريد المزعج (Spam)</Text>
            </View>
            <Pressable style={styles.loginBtn} onPress={() => router.replace('/(auth)/login' as any)}>
              <Text style={styles.loginBtnText}>تسجيل الدخول برمز التحقق</Text>
              <MaterialIcons name="arrow-back" size={18} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    icon: string,
    options?: object
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <MaterialIcons name={icon as any} size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={form[key]}
          onChangeText={v => setForm(p => ({ ...p, [key]: v }))}
          textAlign="right"
          placeholderTextColor={Colors.textLight}
          accessibilityLabel={label}
          {...options}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Pressable style={styles.backBtnHeader} onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>إنشاء حساب جديد</Text>
        <Text style={styles.headerSub}>انضم إلى منصة شركاء للولاء الذكي</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.trialBanner}>
            <MaterialIcons name="card-giftcard" size={20} color={Colors.gold} />
            <Text style={styles.trialText}>تجربة مجانية ١٤ يومًا - بدون بطاقة ائتمان</Text>
          </View>

          {field('name', 'الاسم الكامل *', 'محمد بن سالم', 'person')}
          {field('email', 'البريد الإلكتروني *', 'example@email.com', 'email', {
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
          })}
          {field('phone', 'رقم الهاتف', '+968 9xxx xxxx', 'phone', { keyboardType: 'phone-pad' })}
          {field('password', 'كلمة المرور *', '٦ أحرف على الأقل', 'lock', { secureTextEntry: true })}
          {field('confirmPassword', 'تأكيد كلمة المرور *', 'أعد إدخال كلمة المرور', 'lock-outline', { secureTextEntry: true })}

          <Pressable style={styles.agreeRow} onPress={() => setAgreed(!agreed)}>
            <Text style={styles.agreeText}>
              أوافق على <Text style={styles.agreeLink}>الشروط والأحكام</Text> و<Text style={styles.agreeLink}>سياسة الخصوصية</Text>
            </Text>
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed ? <MaterialIcons name="check" size={14} color={Colors.white} /> : null}
            </View>
          </Pressable>

          <Pressable
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.registerBtnText}>إنشاء الحساب</Text>
                <MaterialIcons name="arrow-back" size={20} color={Colors.white} />
              </>
            )}
          </Pressable>

          <View style={styles.loginRow}>
            <Pressable onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={styles.loginLink}>تسجيل الدخول</Text>
            </Pressable>
            <Text style={styles.loginText}>لديك حساب بالفعل؟</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingBottom: 24, paddingHorizontal: Spacing.md },
  backBtnHeader: { alignSelf: 'flex-end', marginBottom: 12 },
  headerTitle: { color: Colors.white, fontSize: 26, ...Fonts.bold, textAlign: 'center', marginBottom: 4 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center' },
  logoArea: { alignItems: 'center' },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, ...Shadows.gold,
  },
  logoName: { color: Colors.white, fontSize: 22, ...Fonts.bold, textAlign: 'center' },
  content: { padding: Spacing.lg },
  trialBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FEF3C7', borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.lg,
  },
  trialText: { flex: 1, fontSize: 14, color: Colors.goldDark, ...Fonts.semiBold, textAlign: 'right' },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 8 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 52, gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text, textAlign: 'right' },
  agreeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.lg,
    backgroundColor: Colors.gray50, padding: Spacing.md, borderRadius: BorderRadius.md,
  },
  agreeText: { flex: 1, fontSize: 13, color: Colors.textSecondary, textAlign: 'right', lineHeight: 20 },
  agreeLink: { color: Colors.primary, ...Fonts.semiBold },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  registerBtn: {
    backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginBottom: Spacing.lg, ...Shadows.medium,
  },
  registerBtnDisabled: { opacity: 0.7 },
  registerBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  loginText: { fontSize: 15, color: Colors.textSecondary },
  loginLink: { fontSize: 15, ...Fonts.bold, color: Colors.primary },
  // Verify
  verifyContent: { flex: 1, padding: Spacing.lg, justifyContent: 'center', alignItems: 'center' },
  verifyBox: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.xl, alignItems: 'center', gap: 14, ...Shadows.medium, width: '100%',
  },
  verifyTitle: { fontSize: 22, ...Fonts.bold, color: Colors.text, textAlign: 'center' },
  verifyText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  emailHighlight: { color: Colors.primary, ...Fonts.bold },
  verifyNote: { fontSize: 13, color: Colors.textLight, textAlign: 'center', lineHeight: 20 },
  verifyTip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.infoLight, borderRadius: BorderRadius.md, padding: Spacing.sm,
  },
  verifyTipText: { flex: 1, fontSize: 12, color: Colors.info, textAlign: 'right' },
  loginBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: BorderRadius.lg, ...Shadows.medium, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4,
  },
  loginBtnText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
});
