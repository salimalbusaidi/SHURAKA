// Powered by OnSpace.AI - Landing Page Component (extracted from app/index.tsx)
import React, { useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Dimensions, StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SUBSCRIPTION_PLANS } from '@/constants/mockData';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const features = [
    { icon: 'card-giftcard', title: 'بطاقات ولاء ذكية', desc: 'أنشئ بطاقة طوابع أو نظام نقاط مخصص بعلامتك التجارية', color: '#6366F1', bg: '#EEF2FF' },
    { icon: 'account-balance-wallet', title: 'محفظة رقمية', desc: 'محفظة ذكية لكل عميل مع QR Code وسجل كامل للعمليات', color: '#10B981', bg: '#D1FAE5' },
    { icon: 'qr-code-scanner', title: 'مسح QR سريع', desc: 'أضف نقاطًا وطوابع بمسحة واحدة، سريع وسهل للموظفين', color: '#F59E0B', bg: '#FEF3C7' },
    { icon: 'notifications-active', title: 'إشعارات ذكية', desc: 'أرسل عروضًا وتهنئة أعياد ميلاد تلقائيًا لعملائك', color: '#EF4444', bg: '#FEE2E2' },
    { icon: 'bar-chart', title: 'تقارير وتحليلات', desc: 'تابع نمو عملائك ومعدل عودتهم بتقارير بصرية مفصّلة', color: Colors.primary, bg: '#DBEAFE' },
    { icon: 'people', title: 'إدارة الفريق', desc: 'أضف موظفين وحدد صلاحياتهم وتابع عملياتهم بسهولة', color: '#8B5CF6', bg: '#F3E8FF' },
  ];

  const steps = [
    { num: '١', title: 'أنشئ حسابك', desc: 'سجّل مجانًا في أقل من دقيقتين' },
    { num: '٢', title: 'صمّم برنامجك', desc: 'أنشئ بطاقة ولاء أو نظام نقاط بهويتك' },
    { num: '٣', title: 'أضف عملاءك', desc: 'شارك رابط المحفظة أو امسح QR العميل' },
    { num: '٤', title: 'كافئ وكرّر', desc: 'يعودون وتنمو أعمالك تلقائيًا' },
  ];

  const faqs = [
    { q: 'هل يوجد عقد إلزامي؟', a: 'لا، الاشتراكات شهرية ويمكنك الإلغاء في أي وقت بدون غرامات.' },
    { q: 'كيف يصل العميل لمحفظته؟', a: 'عبر رابط خاص أو QR Code أو من خلال التطبيق مباشرة.' },
    { q: 'هل يمكنني استخدامه لأكثر من فرع؟', a: 'نعم، الباقات المتقدمة تدعم حتى 10 فروع.' },
    { q: 'هل بياناتي آمنة؟', a: 'نعم، نستخدم تشفيرًا من الدرجة المصرفية لحماية جميع البيانات.' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}><Text style={styles.logoLetter}>ش</Text></View>
          <Text style={styles.logoName}>شركاء</Text>
        </View>
        <View style={styles.navActions}>
          <Pressable style={styles.navLink} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.navLinkText}>تسجيل الدخول</Text>
          </Pressable>
          <Pressable style={styles.navBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.navBtnText}>ابدأ مجانًا</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={styles.scroll}>
        <LinearGradient colors={[Colors.primary, Colors.primaryLight, '#1E4080']} style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <MaterialIcons name="star" size={14} color={Colors.gold} />
              <Text style={styles.heroBadgeText}>منصة الولاء الرقمية #١ في الخليج</Text>
            </View>
            <Text style={styles.heroTitle}>حوّل عملاءك إلى{'\n'}
              <Text style={{ color: Colors.goldLight }}>شركاء دائمين</Text>
            </Text>
            <Text style={styles.heroSubtitle}>أنشئ بطاقة ولاء ومحفظة ذكية لعملائك، أرسل العروض، تابع الزيارات، وكافئ العملاء بسهولة تامة.</Text>
            <View style={styles.heroBtns}>
              <Pressable style={styles.heroBtn} onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.heroBtnText}>ابدأ الآن مجانًا</Text>
                <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
              </Pressable>
              <Pressable style={styles.heroOutlineBtn} onPress={() => scrollRef.current?.scrollTo({ y: 800, animated: true })}>
                <Text style={styles.heroOutlineBtnText}>شاهد الباقات</Text>
              </Pressable>
            </View>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}><Text style={styles.heroStatValue}>+500</Text><Text style={styles.heroStatLabel}>نشاط تجاري</Text></View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}><Text style={styles.heroStatValue}>+50k</Text><Text style={styles.heroStatLabel}>عميل مخلص</Text></View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}><Text style={styles.heroStatValue}>٩٦٪</Text><Text style={styles.heroStatLabel}>رضا العملاء</Text></View>
            </View>
          </View>
          <Image source={require('@/assets/images/hero-banner.png')} style={styles.heroImage} contentFit="cover" />
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>ما هو شركاء؟</Text></View>
            <Text style={styles.sectionTitle}>منصة ولاء رقمية متكاملة{'\n'}لنشاطك التجاري</Text>
            <Text style={styles.sectionSubtitle}>شركاء يساعدك على بناء علاقات دائمة مع عملائك من خلال برامج ولاء ذكية تزيد من تكرار زياراتهم وترفع مبيعاتك.</Text>
          </View>
          <View style={styles.featuresGrid}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
                  <MaterialIcons name={f.icon as any} size={28} color={f.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.howSection}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionBadge, { backgroundColor: 'rgba(201,168,76,0.2)' }]}>
              <Text style={[styles.sectionBadgeText, { color: Colors.goldLight }]}>كيف يعمل؟</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: Colors.white }]}>٤ خطوات للبدء{'\n'}<Text style={{ color: Colors.goldLight }}>وزيادة ولاء عملائك</Text></Text>
          </View>
          <View style={styles.stepsContainer}>
            {steps.map((step, i) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{step.num}</Text></View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>الباقات والأسعار</Text></View>
            <Text style={styles.sectionTitle}>ابدأ مجانًا لمدة ١٤ يومًا</Text>
            <Text style={styles.sectionSubtitle}>اختر الباقة المناسبة لحجم نشاطك. يمكنك الترقية أو التخفيض في أي وقت.</Text>
          </View>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <View key={plan.id} style={[styles.planCard, plan.popular && styles.planCardPopular]}>
              {plan.popular ? (
                <View style={styles.popularBadge}>
                  <MaterialIcons name="star" size={12} color={Colors.white} />
                  <Text style={styles.popularBadgeText}>الأكثر شعبية</Text>
                </View>
              ) : null}
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planNameEn}>{plan.nameEn}</Text>
                </View>
                <View style={styles.planPriceBox}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <View>
                    <Text style={styles.planCurrency}>{plan.currency}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.planFeatures}>
                {plan.features.slice(0, 6).map((f, fi) => (
                  <View key={fi} style={styles.planFeature}>
                    <MaterialIcons name={f.included ? 'check-circle' : 'cancel'} size={18} color={f.included ? Colors.success : Colors.gray300} />
                    <Text style={[styles.planFeatureText, !f.included && styles.planFeatureDisabled]}>{f.text}</Text>
                  </View>
                ))}
              </View>
              <Pressable style={[styles.planBtn, plan.popular && styles.planBtnPopular]} onPress={() => router.push('/(auth)/register')}>
                <Text style={[styles.planBtnText, plan.popular && styles.planBtnTextPopular]}>جرّب مجانًا ١٤ يومًا</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: Colors.gray50 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>الأسئلة الشائعة</Text></View>
            <Text style={styles.sectionTitle}>كل ما تريد معرفته</Text>
          </View>
          {faqs.map((faq, i) => (
            <View key={i} style={styles.faqItem}>
              <View style={styles.faqQ}>
                <MaterialIcons name="help-outline" size={20} color={Colors.gold} />
                <Text style={styles.faqQuestion}>{faq.q}</Text>
              </View>
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            </View>
          ))}
        </View>

        <LinearGradient colors={[Colors.gold, Colors.goldDark]} style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>ابدأ مجانًا اليوم</Text>
          <Text style={styles.ctaSubtitle}>انضم إلى أكثر من ٥٠٠ نشاط تجاري يثقون بشركاء</Text>
          <Pressable style={styles.ctaBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.ctaBtnText}>إنشاء حساب مجاني</Text>
            <MaterialIcons name="arrow-back" size={20} color={Colors.gold} />
          </Pressable>
        </LinearGradient>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.footerLogo}>
            <View style={styles.footerLogoIcon}><Text style={styles.footerLogoLetter}>ش</Text></View>
            <Text style={styles.footerBrand}>شركاء</Text>
          </View>
          <Text style={styles.footerTagline}>حوّل كل زيارة إلى فرصة ولاء</Text>
          <Text style={styles.footerCopy}>© 2025 شركاء - جميع الحقوق محفوظة</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>الخصوصية</Text>
            <Text style={styles.footerDivider}>·</Text>
            <Text style={styles.footerLink}>الشروط</Text>
            <Text style={styles.footerDivider}>·</Text>
            <Text style={styles.footerLink}>تواصل معنا</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 12, backgroundColor: Colors.primary },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: Colors.white, fontSize: 18, ...Fonts.bold },
  logoName: { color: Colors.white, fontSize: 22, ...Fonts.bold },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navLink: { paddingHorizontal: 12, paddingVertical: 8 },
  navLinkText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, ...Fonts.medium },
  navBtn: { backgroundColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.md },
  navBtnText: { color: Colors.white, fontSize: 14, ...Fonts.bold },
  scroll: { flex: 1 },
  hero: { paddingHorizontal: Spacing.md, paddingTop: 40, paddingBottom: 40 },
  heroContent: { alignItems: 'flex-end' },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(201,168,76,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full, marginBottom: 20 },
  heroBadgeText: { color: Colors.goldLight, fontSize: 13, ...Fonts.medium },
  heroTitle: { fontSize: width < 400 ? 28 : 34, ...Fonts.extraBold, color: Colors.white, textAlign: 'right', lineHeight: width < 400 ? 38 : 46, marginBottom: 16 },
  heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'right', lineHeight: 26, marginBottom: 28 },
  heroBtns: { flexDirection: 'row', gap: 12, marginBottom: 32, alignSelf: 'flex-end' },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.gold, paddingHorizontal: 24, paddingVertical: 14, borderRadius: BorderRadius.lg, ...Shadows.gold },
  heroBtnText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  heroOutlineBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center' },
  heroOutlineBtnText: { color: Colors.white, fontSize: 16, ...Fonts.semiBold },
  heroStats: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 16 },
  heroStat: { alignItems: 'center' },
  heroStatValue: { color: Colors.goldLight, fontSize: 22, ...Fonts.extraBold },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  heroStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroImage: { width: '100%', height: 200, borderRadius: BorderRadius.xl, marginTop: 24, opacity: 0.9 },
  section: { padding: Spacing.lg },
  sectionHeader: { alignItems: 'flex-end', marginBottom: Spacing.lg },
  sectionBadge: { backgroundColor: Colors.gray100, paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full, marginBottom: 12 },
  sectionBadgeText: { color: Colors.primary, fontSize: 13, ...Fonts.semiBold },
  sectionTitle: { fontSize: 24, ...Fonts.bold, color: Colors.text, textAlign: 'right', lineHeight: 34, marginBottom: 12 },
  sectionSubtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'right', lineHeight: 24 },
  featuresGrid: { gap: 12 },
  featureCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.small, flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  featureIcon: { width: 52, height: 52, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 16, ...Fonts.bold, color: Colors.text, marginBottom: 4, textAlign: 'right' },
  featureDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, textAlign: 'right' },
  howSection: { padding: Spacing.lg },
  stepsContainer: { gap: 16 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  stepNum: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: Colors.white, fontSize: 18, ...Fonts.bold },
  stepContent: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 17, ...Fonts.bold, color: Colors.white, marginBottom: 4 },
  stepDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  planCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.medium, borderWidth: 1.5, borderColor: Colors.border },
  planCardPopular: { borderColor: Colors.gold, borderWidth: 2, ...Shadows.gold },
  popularBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gold, alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.full, marginBottom: 12 },
  popularBadgeText: { color: Colors.white, fontSize: 12, ...Fonts.bold },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  planName: { fontSize: 22, ...Fonts.bold, color: Colors.text },
  planNameEn: { fontSize: 12, color: Colors.textSecondary, ...Fonts.medium },
  planPriceBox: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  planPrice: { fontSize: 36, ...Fonts.extraBold, color: Colors.primary },
  planCurrency: { fontSize: 14, ...Fonts.bold, color: Colors.textSecondary, lineHeight: 18 },
  planPeriod: { fontSize: 12, color: Colors.textLight },
  planFeatures: { gap: 10, marginBottom: Spacing.lg },
  planFeature: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  planFeatureText: { fontSize: 14, color: Colors.text, flex: 1, textAlign: 'right' },
  planFeatureDisabled: { color: Colors.gray400 },
  planBtn: { backgroundColor: Colors.gray100, paddingVertical: 14, borderRadius: BorderRadius.lg, alignItems: 'center' },
  planBtnPopular: { backgroundColor: Colors.gold, ...Shadows.gold },
  planBtnText: { fontSize: 16, ...Fonts.bold, color: Colors.text },
  planBtnTextPopular: { color: Colors.white },
  faqItem: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.small },
  faqQ: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  faqQuestion: { fontSize: 15, ...Fonts.bold, color: Colors.text, flex: 1, textAlign: 'right' },
  faqAnswer: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, textAlign: 'right', paddingRight: 30 },
  ctaSection: { margin: Spacing.lg, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'flex-end' },
  ctaTitle: { fontSize: 28, ...Fonts.bold, color: Colors.white, textAlign: 'right', marginBottom: 8 },
  ctaSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'right', marginBottom: 24 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, paddingHorizontal: 28, paddingVertical: 14, borderRadius: BorderRadius.lg },
  ctaBtnText: { fontSize: 16, ...Fonts.bold, color: Colors.gold },
  footer: { backgroundColor: Colors.primary, padding: Spacing.lg, alignItems: 'flex-end' },
  footerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  footerLogoIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  footerLogoLetter: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  footerBrand: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  footerTagline: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 16 },
  footerCopy: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 12 },
  footerLinks: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  footerLink: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  footerDivider: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
});
