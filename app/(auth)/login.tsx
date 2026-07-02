// Powered by OnSpace.AI - Passwordless OTP Login (4-digit, smart session)
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Pressable, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { UserRole } from '@/contexts/AuthContext';

type Step = 'email' | 'otp';

const OTP_LENGTH = 4;

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const masked =
    local.length <= 2
      ? local[0] + '***'
      : local[0] + '*'.repeat(Math.min(local.length - 1, 4)) + local[local.length - 1];
  return `${masked}@${domain}`;
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sendOTP, verifyOTP, loginWithGoogle, isAuthenticated, user } = useAuth();
  const { showAlert } = useAlert();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigateByRole(user.role);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const navigateByRole = (role: UserRole) => {
    if (role === 'admin') router.replace('/(admin)' as any);
    else if (role === 'customer') router.replace('/(customer)' as any);
    else if (role === 'employee') router.replace('/(business)/scanner' as any);
    else router.replace('/(business)' as any);
  };

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleSendOTP = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      showAlert('خطأ', 'البريد الإلكتروني مطلوب');
      return;
    }
    if (!validateEmail(trimmed)) {
      showAlert('خطأ', 'صيغة البريد الإلكتروني غير صحيحة');
      return;
    }

    setLoading(true);
    const result = await sendOTP(trimmed);
    setLoading(false);

    if (!result.success) {
      if (result.code === 'EMAIL_NOT_FOUND') {
        showAlert('البريد غير مسجل', 'هذا البريد غير مسجل لدينا. هل تريد إنشاء حساب جديد؟', [
          { text: 'إنشاء حساب', onPress: () => router.push('/(auth)/register' as any) },
          { text: 'إلغاء', style: 'cancel' },
        ]);
      } else if (result.code === 'ACCOUNT_DISABLED') {
        showAlert('الحساب غير مفعل', 'هذا الحساب غير مفعل، يرجى التواصل مع الدعم');
      } else {
        showAlert('خطأ', result.error || 'تعذر إرسال رمز التحقق، حاول مرة أخرى');
      }
      return;
    }

    setOtp(Array(OTP_LENGTH).fill(''));
    setAttempts(0);
    setStep('otp');
    startResendTimer();
    setTimeout(() => otpRefs.current[0]?.focus(), 400);
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      showAlert('خطأ', `يرجى إدخال رمز التحقق كاملاً (${OTP_LENGTH} أرقام)`);
      return;
    }
    if (attempts >= 5) {
      showAlert('تجاوزت الحد المسموح', 'لقد تجاوزت ٥ محاولات. يرجى طلب رمز جديد', [
        { text: 'طلب رمز جديد', onPress: handleResend },
        { text: 'إلغاء', style: 'cancel' },
      ]);
      return;
    }

    setLoading(true);
    const result = await verifyOTP(email.trim(), code);
    setLoading(false);

    if (!result.success) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (result.code === 'OTP_EXPIRED') {
        showAlert('انتهت الصلاحية', 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد', [
          { text: 'طلب رمز جديد', onPress: handleResend },
          { text: 'إلغاء', style: 'cancel' },
        ]);
      } else if (newAttempts >= 5) {
        showAlert('تجاوزت الحد', 'لقد تجاوزت ٥ محاولات خاطئة. يرجى طلب رمز جديد', [
          { text: 'طلب رمز جديد', onPress: handleResend },
          { text: 'إلغاء', style: 'cancel' },
        ]);
      } else {
        showAlert('رمز خاطئ', `${result.error || 'رمز التحقق غير صحيح'}\n(محاولات متبقية: ${5 - newAttempts})`);
      }
      setOtp(Array(OTP_LENGTH).fill(''));
      otpRefs.current[0]?.focus();
      return;
    }

    if (result.role) navigateByRole(result.role);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setAttempts(0);
    setLoading(true);
    const result = await sendOTP(email.trim());
    setLoading(false);
    if (result.success) {
      startResendTimer();
      showAlert('تم الإرسال', 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني');
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } else {
      showAlert('خطأ', result.error || 'تعذر إعادة الإرسال');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    if (digit && index === OTP_LENGTH - 1 && newOtp.every(d => d !== '')) {
      setTimeout(() => handleVerifyOTP(), 100);
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Email Step ────────────────────────────────────────────────
  if (step === 'email') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={[styles.header, { paddingTop: insets.top + 24 }]}
        >
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>ش</Text>
            </View>
            <Text style={styles.logoName}>شركاء</Text>
            <Text style={styles.logoTagline}>منصة الولاء الذكية</Text>
          </View>
        </LinearGradient>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.welcomeTitle}>مرحبًا بك في شركاء</Text>
            <Text style={styles.welcomeSubtitle}>
              سجّل دخولك لإدارة برنامج الولاء والمحافظ الذكية لعملائك
            </Text>

            <View style={styles.infoCard}>
              <MaterialIcons name="security" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                سنرسل رمز تحقق مكوّن من {OTP_LENGTH} أرقام إلى بريدك الإلكتروني — لا تحتاج لكلمة مرور
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <View style={styles.inputBox}>
                <MaterialIcons name="email" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textAlign="right"
                  placeholderTextColor={Colors.textLight}
                  accessibilityLabel="البريد الإلكتروني"
                  returnKeyType="send"
                  onSubmitEditing={handleSendOTP}
                  autoFocus
                />
              </View>
            </View>

            <Pressable
              style={[styles.primaryBtn, loading && styles.btnDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>تسجيل الدخول</Text>
                  <MaterialIcons name="arrow-back" size={20} color={Colors.white} />
                </>
              )}
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.googleBtn}
              onPress={async () => {
                setLoading(true);
                const r = await loginWithGoogle();
                setLoading(false);
                if (!r.success) showAlert('خطأ', r.error || 'فشل تسجيل الدخول عبر Google');
              }}
              disabled={loading}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>المتابعة عبر Google</Text>
            </Pressable>

            <View style={styles.registerRow}>
              <Pressable onPress={() => router.push('/(auth)/register' as any)}>
                <Text style={styles.registerLink}>إنشاء حساب جديد</Text>
              </Pressable>
              <Text style={styles.registerText}>ليس لديك حساب؟</Text>
            </View>

            <View style={styles.legalLinks}>
              <Pressable onPress={() => router.push('/(legal)/privacy-policy' as any)}>
                <Text style={styles.legalLink}>سياسة الخصوصية</Text>
              </Pressable>
              <Text style={styles.legalDot}>·</Text>
              <Pressable onPress={() => router.push('/(legal)/privacy-policy' as any)}>
                <Text style={styles.legalLink}>الشروط والأحكام</Text>
              </Pressable>
              <Text style={styles.legalDot}>·</Text>
              <Pressable onPress={() => {}}>
                <Text style={styles.legalLink}>تواصل معنا</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // ── OTP Step ─────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Pressable style={styles.backBtn} onPress={() => setStep('email')}>
          <MaterialIcons name="arrow-forward" size={22} color={Colors.white} />
          <Text style={styles.backBtnText}>تغيير البريد</Text>
        </Pressable>
        <View style={styles.logoArea}>
          <View style={[styles.logoCircle, { backgroundColor: Colors.success }]}>
            <MaterialIcons name="mark-email-read" size={32} color={Colors.white} />
          </View>
          <Text style={styles.logoName}>تحقق من بريدك</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.otpTitle}>أدخل رمز التحقق</Text>
          <Text style={styles.otpSubtitle}>
            تم إرسال رمز مكوّن من {OTP_LENGTH} أرقام إلى بريدك الإلكتروني
          </Text>
          <Text style={styles.otpEmail}>{maskEmail(email)}</Text>

          {/* OTP Boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={ref => { otpRefs.current[i] = ref; }}
                style={[styles.otpBox, digit !== '' && styles.otpBoxFilled]}
                value={digit}
                onChangeText={v => handleOtpChange(v, i)}
                onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                accessibilityLabel={`الرقم ${i + 1}`}
              />
            ))}
          </View>

          {attempts > 0 ? (
            <View style={styles.attemptsWarning}>
              <MaterialIcons name="warning" size={16} color={Colors.warning} />
              <Text style={styles.attemptsText}>
                {attempts >= 5
                  ? 'تجاوزت الحد المسموح. اطلب رمزًا جديدًا.'
                  : `محاولات خاطئة: ${attempts}/5`}
              </Text>
            </View>
          ) : null}

          <Pressable
            style={[styles.primaryBtn, (loading || attempts >= 5) && styles.btnDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading || attempts >= 5}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.primaryBtnText}>تأكيد الرمز</Text>
                <MaterialIcons name="check-circle" size={20} color={Colors.white} />
              </>
            )}
          </Pressable>

          <View style={styles.resendRow}>
            {resendTimer > 0 ? (
              <Text style={styles.resendTimer}>إعادة الإرسال بعد {resendTimer}ث</Text>
            ) : (
              <Pressable onPress={handleResend} disabled={loading} style={styles.resendBtn}>
                <MaterialIcons name="refresh" size={18} color={Colors.primary} />
                <Text style={styles.resendText}>إعادة إرسال الرمز</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.helpCard}>
            <MaterialIcons name="info-outline" size={18} color={Colors.info} />
            <Text style={styles.helpText}>
              إذا لم تصلك الرسالة، تحقق من مجلد البريد المزعج (Spam). الرمز صالح لمدة ١٠ دقائق فقط.
            </Text>
          </View>

          <Pressable style={styles.changeEmailBtn} onPress={() => setStep('email')}>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.textSecondary} />
            <Text style={styles.changeEmailText}>تغيير البريد الإلكتروني</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingBottom: 32, paddingHorizontal: Spacing.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end', marginBottom: 12 },
  backBtnText: { color: Colors.white, fontSize: 14, ...Fonts.medium },
  logoArea: { alignItems: 'center' },
  logoCircle: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, ...Shadows.gold,
  },
  logoLetter: { color: Colors.white, fontSize: 34, ...Fonts.bold },
  logoName: { color: Colors.white, fontSize: 28, ...Fonts.bold, marginBottom: 4 },
  logoTagline: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  content: { padding: Spacing.lg },
  welcomeTitle: { fontSize: 22, ...Fonts.bold, color: Colors.text, textAlign: 'center', marginBottom: 8 },
  welcomeSubtitle: {
    fontSize: 14, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.infoLight, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.lg,
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.info, lineHeight: 20, textAlign: 'right' },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 8 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 54, gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text, textAlign: 'right' },
  primaryBtn: {
    backgroundColor: Colors.primary, height: 54, borderRadius: BorderRadius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginBottom: Spacing.md, ...Shadows.medium,
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 13, color: Colors.textSecondary },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 52, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white, marginBottom: Spacing.lg,
  },
  googleIcon: { fontSize: 20, color: '#DB4437', ...Fonts.bold },
  googleBtnText: { fontSize: 15, ...Fonts.semiBold, color: Colors.text },
  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: Spacing.lg },
  registerText: { fontSize: 14, color: Colors.textSecondary },
  registerLink: { fontSize: 14, ...Fonts.bold, color: Colors.primary },
  legalLinks: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    flexWrap: 'wrap', gap: 6,
  },
  legalLink: { fontSize: 12, color: Colors.primary },
  legalDot: { fontSize: 12, color: Colors.textLight },
  // OTP Step
  otpTitle: { fontSize: 24, ...Fonts.bold, color: Colors.text, textAlign: 'center', marginBottom: 8 },
  otpSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  otpEmail: { fontSize: 16, ...Fonts.bold, color: Colors.primary, textAlign: 'center', marginBottom: 32 },
  otpRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 14, marginBottom: Spacing.lg,
  },
  otpBox: {
    width: 62, height: 68, borderRadius: BorderRadius.md,
    borderWidth: 2, borderColor: Colors.border,
    backgroundColor: Colors.gray50, fontSize: 26, ...Fonts.bold,
    color: Colors.text,
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  attemptsWarning: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.warningLight, borderRadius: BorderRadius.md,
    padding: Spacing.sm, marginBottom: Spacing.md,
  },
  attemptsText: { flex: 1, fontSize: 13, color: Colors.warning, ...Fonts.semiBold, textAlign: 'right' },
  resendRow: { alignItems: 'center', marginBottom: Spacing.lg, marginTop: -4 },
  resendBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resendText: { color: Colors.primary, fontSize: 14, ...Fonts.semiBold },
  resendTimer: { color: Colors.textLight, fontSize: 14 },
  helpCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.gray50, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.lg,
  },
  helpText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20, textAlign: 'right' },
  changeEmailBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  changeEmailText: { fontSize: 14, color: Colors.textSecondary },
});
