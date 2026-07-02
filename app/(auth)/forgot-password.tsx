// Powered by OnSpace.AI - Real Password Reset
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      showAlert('خطأ', 'يرجى إدخال بريدك الإلكتروني');
      return;
    }
    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      showAlert('خطأ', result.error || 'فشل إرسال رابط الاستعادة');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
        </Pressable>
        <View style={styles.iconArea}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="lock-reset" size={36} color={Colors.gold} />
          </View>
        </View>
        <Text style={styles.headerTitle}>استعادة كلمة المرور</Text>
        <Text style={styles.headerSub}>أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
          {sent ? (
            <View style={styles.successBox}>
              <View style={styles.successIcon}>
                <MaterialIcons name="mark-email-read" size={48} color={Colors.success} />
              </View>
              <Text style={styles.successTitle}>تم الإرسال!</Text>
              <Text style={styles.successText}>تم إرسال رابط استعادة كلمة المرور إلى{'\n'}<Text style={{ color: Colors.primary, fontWeight: '700' }}>{email}</Text></Text>
              <Text style={styles.successNote}>تحقق من صندوق البريد الوارد أو البريد المزعج</Text>
              <Pressable style={styles.backToLoginBtn} onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.backToLoginText}>العودة لتسجيل الدخول</Text>
              </Pressable>
            </View>
          ) : (
            <View>
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
                  />
                </View>
              </View>
              <Pressable style={[styles.sendBtn, loading && styles.sendBtnDisabled]} onPress={handleSend} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <Text style={styles.sendBtnText}>إرسال رابط الاستعادة</Text>
                    <MaterialIcons name="send" size={20} color={Colors.white} />
                  </>
                )}
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
                <Text style={styles.cancelBtnText}>العودة</Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingBottom: 30, paddingHorizontal: Spacing.md },
  backBtn: { alignSelf: 'flex-end', marginBottom: 16 },
  iconArea: { alignItems: 'center', marginBottom: 16 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.white, fontSize: 24, ...Fonts.bold, textAlign: 'center', marginBottom: 8 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  content: { flex: 1, padding: Spacing.lg, justifyContent: 'center' },
  inputGroup: { marginBottom: Spacing.lg },
  label: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, height: 52, gap: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text, textAlign: 'right' },
  sendBtn: { backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: Spacing.md, ...Shadows.medium },
  sendBtnDisabled: { opacity: 0.7 },
  sendBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
  cancelBtn: { alignItems: 'center', padding: Spacing.md },
  cancelBtnText: { color: Colors.textSecondary, fontSize: 15 },
  successBox: { alignItems: 'center', padding: Spacing.lg, gap: 16 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.successLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 28, ...Fonts.bold, color: Colors.text },
  successText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  successNote: { fontSize: 13, color: Colors.textLight, textAlign: 'center' },
  backToLoginBtn: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.lg, ...Shadows.medium },
  backToLoginText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
});
