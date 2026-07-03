// Powered by OnSpace.AI - Professional RTL Login Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { UserRole } from '@/contexts/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { user, isAuthenticated, isLoading, loginWithPassword } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      navigateByRole(user.role);
    }
  }, [isAuthenticated, isLoading, user]);

  const navigateByRole = (role: UserRole) => {
    if (role === 'admin') router.replace('/(admin)' as any);
    else if (role === 'customer') router.replace('/(customer)' as any);
    else if (role === 'employee') router.replace('/(business)/scanner' as any);
    else router.replace('/(business)' as any);
  };

  const validateForm = () => {
    if (!email.trim()) {
      showAlert('خطأ', 'البريد الإلكتروني مطلوب');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      showAlert('خطأ', 'صيغة البريد الإلكتروني غير صحيحة');
      return false;
    }
    if (!password.trim()) {
      showAlert('خطأ', 'كلمة المرور مطلوبة');
      return false;
    }
    if (password.length < 6) {
      showAlert('خطأ', 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const result = await loginWithPassword(email.trim().toLowerCase(), password);
    setLoading(false);
    if (!result.success) {
      showAlert('فشل تسجيل الدخول', result.error || 'تعذر تسجيل الدخول، حاول مرة أخرى');
    }
  };

  const accentBackground = isDarkMode ? '#081229' : Colors.primary;
  const surfaceBackground = isDarkMode ? '#102746' : Colors.white;
  const textColor = isDarkMode ? Colors.white : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.gray300 : Colors.textSecondary;
  const borderColor = isDarkMode ? '#20345F' : Colors.border;
  const cardBackground = isDarkMode ? '#112347' : Colors.white;

  return (
    <View style={[styles.container, { backgroundColor: accentBackground }]}> 
      <LinearGradient
        colors={isDarkMode ? ['#081229', '#101F3F'] : [Colors.primary, Colors.primaryLight]}
        style={[styles.header, { paddingTop: insets.top + 24 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLetter}>ش</Text>
          </View>
          <Text style={styles.headerTitle}>مرحبًا بك في شركاء</Text>
          <Text style={styles.headerSubtitle}>الوصول السريع لحسابك وإدارة عملائك بسهولة.</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}> 
            <Text style={[styles.sectionTitle, { color: textColor }]}>تسجيل الدخول</Text>
            <Text style={[styles.sectionSubtitle, { color: secondaryTextColor }]}>استخدم بريدك وكلمة المرور لتسجيل الدخول.</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>البريد الإلكتروني</Text>
              <View style={[styles.inputBox, { borderColor, backgroundColor: surfaceBackground }]}> 
                <MaterialIcons name="email" size={20} color={secondaryTextColor} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="example@email.com"
                  placeholderTextColor={secondaryTextColor}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  textAlign="right"
                  returnKeyType="next"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>كلمة المرور</Text>
              <View style={[styles.inputBox, { borderColor, backgroundColor: surfaceBackground }]}> 
                <MaterialIcons name="lock" size={20} color={secondaryTextColor} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="••••••••"
                  placeholderTextColor={secondaryTextColor}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textAlign="right"
                  returnKeyType="done"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable onPress={() => router.push('/(auth)/forgot-password' as any)}>
                <Text style={[styles.linkText, { color: Colors.gold }]}>نسيت كلمة المرور؟</Text>
              </Pressable>
            </View>

            <Pressable style={[styles.primaryBtn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.primaryBtnText}>تسجيل الدخول</Text>}
            </Pressable>

            <View style={styles.footerRow}> 
              <Text style={[styles.footerText, { color: secondaryTextColor }]}>ليس لديك حساب؟</Text>
              <Pressable onPress={() => router.push('/(auth)/register' as any)}>
                <Text style={[styles.linkText, { color: Colors.primaryLight }]}>إنشاء حساب جديد</Text>
              </Pressable>
            </View>

            <Text style={[styles.disclaimerText, { color: secondaryTextColor }]}>باستمرارك، أنت توافق على الشروط وسياسة الخصوصية الخاصة بنا.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  brandBadge: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  brandLetter: { fontSize: 28, color: Colors.white, ...Fonts.extraBold },
  headerTitle: { color: Colors.white, fontSize: 28, ...Fonts.bold, lineHeight: 36, marginBottom: 8, textAlign: 'right' },
  headerSubtitle: { color: 'rgba(255,255,255,0.82)', fontSize: 14, ...Fonts.medium, lineHeight: 22, textAlign: 'right' },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: -Spacing.xl,
    marginHorizontal: Spacing.sm,
    ...Shadows.large,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 22, ...Fonts.bold, marginBottom: 6, textAlign: 'right' },
  sectionSubtitle: { fontSize: 14, ...Fonts.medium, lineHeight: 22, marginBottom: Spacing.lg, textAlign: 'right' },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: 13, ...Fonts.semiBold, marginBottom: 8, textAlign: 'right' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 54,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, ...Fonts.regular },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: Spacing.md },
  linkText: { fontSize: 14, ...Fonts.bold },
  primaryBtn: {
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  primaryBtnText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  btnDisabled: { opacity: 0.7 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
  footerText: { fontSize: 14, ...Fonts.regular },
  disclaimerText: { fontSize: 12, ...Fonts.regular, marginTop: Spacing.lg, textAlign: 'center', lineHeight: 20 },
});

