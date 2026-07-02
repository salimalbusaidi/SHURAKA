// Powered by OnSpace.AI - Onboarding Wizard
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Pressable, Dimensions, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SUBSCRIPTION_PLANS } from '@/constants/mockData';
import { useBusiness } from '@/hooks/useBusiness';
import { useAlert } from '@/template';

const { width } = Dimensions.get('window');
const TOTAL_STEPS = 5;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateBusiness } = useBusiness();
  const { showAlert } = useAlert();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    business_name: '',
    category: '',
    phone: '',
    address: '',
    plan: 'growth',
    loyalty_name: '',
    loyalty_type: 'stamps',
    stamp_count: '10',
    reward_desc: '',
  });

  const categories = ['مقاهي ومطاعم', 'تجميل وعناية', 'تجزئة وسوبرماركت', 'صحة وليياضة', 'تعليم', 'سيارات', 'فندقة وسفر', 'أخرى'];

  const next = () => {
    if (step === 1 && !form.business_name) { showAlert('', 'يرجى إدخال اسم النشاط التجاري'); return; }
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else completeOnboarding();
  };

  const completeOnboarding = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    updateBusiness({ business_name: form.business_name });
    setLoading(false);
    router.replace('/(business)');
  };

  const stepTitles = [
    'معلومات نشاطك',
    'اختر باقتك',
    'صمّم برنامج الولاء',
    'أضف أول مكافأة',
    'شارك مع فريقك',
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{stepTitles[0]}</Text>
            <Text style={styles.stepDesc}>أخبرنا عن نشاطك التجاري حتى نساعدك بشكل أفضل</Text>
            <View style={styles.field}>
              <Text style={styles.label}>اسم النشاط التجاري *</Text>
              <TextInput style={styles.input} placeholder="مثال: مقهى السعادة" value={form.business_name} onChangeText={v => setForm(p => ({ ...p, business_name: v }))} textAlign="right" placeholderTextColor={Colors.textLight} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>نوع النشاط</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -Spacing.lg }}>
                <View style={styles.categoryRow}>
                  {categories.map(cat => (
                    <Pressable key={cat} style={[styles.categoryChip, form.category === cat && styles.categoryChipActive]} onPress={() => setForm(p => ({ ...p, category: cat }))}>
                      <Text style={[styles.categoryChipText, form.category === cat && styles.categoryChipTextActive]}>{cat}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>رقم الهاتف</Text>
              <TextInput style={styles.input} placeholder="+968 9xxx xxxx" value={form.phone} onChangeText={v => setForm(p => ({ ...p, phone: v }))} keyboardType="phone-pad" textAlign="right" placeholderTextColor={Colors.textLight} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>العنوان</Text>
              <TextInput style={styles.input} placeholder="المدينة - الحي - الشارع" value={form.address} onChangeText={v => setForm(p => ({ ...p, address: v }))} textAlign="right" placeholderTextColor={Colors.textLight} />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{stepTitles[1]}</Text>
            <Text style={styles.stepDesc}>اختر الباقة المناسبة - يمكنك تغييرها لاحقًا</Text>
            {SUBSCRIPTION_PLANS.map(plan => (
              <Pressable key={plan.id} style={[styles.planCard, form.plan === plan.id && styles.planCardSelected]} onPress={() => setForm(p => ({ ...p, plan: plan.id }))}>
                <View style={styles.planCardHeader}>
                  <View style={styles.planRadio}>
                    {form.plan === plan.id ? <View style={styles.planRadioActive} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planCardName}>{plan.name}</Text>
                    <Text style={styles.planCardPrice}>{plan.price} {plan.currency} شهريًا</Text>
                  </View>
                  {plan.popular ? <View style={styles.popularTag}><Text style={styles.popularTagText}>الأشهر</Text></View> : null}
                </View>
                <Text style={styles.planCardFeature}>
                  {plan.features.filter(f => f.included).slice(0, 3).map(f => f.text).join(' · ')}
                </Text>
                <View style={styles.trialTag}>
                  <MaterialIcons name="card-giftcard" size={14} color={Colors.gold} />
                  <Text style={styles.trialTagText}>تجربة مجانية {plan.trial_days} يومًا</Text>
                </View>
              </Pressable>
            ))}
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{stepTitles[2]}</Text>
            <Text style={styles.stepDesc}>صمّم برنامج الولاء المناسب لنشاطك</Text>
            <View style={styles.loyaltyTypes}>
              {[
                { id: 'stamps', icon: 'local-cafe', label: 'بطاقة طوابع', desc: 'اشترِ X واحصل على الـ (X+١) مجانًا' },
                { id: 'points', icon: 'star', label: 'نظام نقاط', desc: 'كل مبلغ = نقاط قابلة للاستبدال' },
                { id: 'coupon', icon: 'local-offer', label: 'كوبون خصم', desc: 'أرسل خصومات مباشرة للعملاء' },
              ].map(lt => (
                <Pressable key={lt.id} style={[styles.loyaltyType, form.loyalty_type === lt.id && styles.loyaltyTypeActive]} onPress={() => setForm(p => ({ ...p, loyalty_type: lt.id }))}>
                  <View style={[styles.loyaltyIcon, { backgroundColor: form.loyalty_type === lt.id ? Colors.primary : Colors.gray100 }]}>
                    <MaterialIcons name={lt.icon as any} size={24} color={form.loyalty_type === lt.id ? Colors.white : Colors.textSecondary} />
                  </View>
                  <Text style={[styles.loyaltyLabel, form.loyalty_type === lt.id && styles.loyaltyLabelActive]}>{lt.label}</Text>
                  <Text style={styles.loyaltyDesc}>{lt.desc}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>اسم برنامج الولاء</Text>
              <TextInput style={styles.input} placeholder="مثال: بطاقة القهوة الذهبية" value={form.loyalty_name} onChangeText={v => setForm(p => ({ ...p, loyalty_name: v }))} textAlign="right" placeholderTextColor={Colors.textLight} />
            </View>
            {form.loyalty_type === 'stamps' ? (
              <View style={styles.field}>
                <Text style={styles.label}>عدد الطوابع المطلوبة</Text>
                <TextInput style={styles.input} placeholder="مثال: 10" value={form.stamp_count} onChangeText={v => setForm(p => ({ ...p, stamp_count: v }))} keyboardType="number-pad" textAlign="right" placeholderTextColor={Colors.textLight} />
              </View>
            ) : null}
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{stepTitles[3]}</Text>
            <Text style={styles.stepDesc}>ما هي المكافأة التي ستمنحها للعملاء المخلصين؟</Text>
            <View style={styles.rewardPreview}>
              <View style={styles.rewardIcon}>
                <MaterialIcons name="card-giftcard" size={40} color={Colors.gold} />
              </View>
              <Text style={styles.rewardHint}>مثال: مشروب مجاني، خصم 20%، وجبة مجانية</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>وصف المكافأة</Text>
              <TextInput style={[styles.input, styles.textarea]} placeholder="مثال: قهوة مجانية من اختيارك عند اكتمال البطاقة" value={form.reward_desc} onChangeText={v => setForm(p => ({ ...p, reward_desc: v }))} textAlign="right" multiline numberOfLines={3} placeholderTextColor={Colors.textLight} />
            </View>
            <View style={styles.tipBox}>
              <MaterialIcons name="lightbulb" size={18} color={Colors.gold} />
              <Text style={styles.tipText}>نصيحة: المكافآت الجذابة تزيد من عودة العملاء بنسبة ٦٠٪</Text>
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{stepTitles[4]}</Text>
            <Text style={styles.stepDesc}>شارك رابط الانضمام مع موظفيك وعملائك الأوائل</Text>
            <View style={styles.shareOptions}>
              {[
                { icon: 'content-copy', label: 'نسخ رابط الدعوة', color: Colors.info },
                { icon: 'share', label: 'مشاركة عبر واتساب', color: Colors.success },
                { icon: 'email', label: 'إرسال بالبريد', color: Colors.primary },
                { icon: 'qr-code', label: 'عرض QR Code الدعوة', color: Colors.gold },
              ].map((opt, i) => (
                <Pressable key={i} style={styles.shareOption} onPress={() => showAlert('', `سيتم ${opt.label} قريبًا`)}>
                  <View style={[styles.shareIcon, { backgroundColor: opt.color + '20' }]}>
                    <MaterialIcons name={opt.icon as any} size={24} color={opt.color} />
                  </View>
                  <Text style={styles.shareLabel}>{opt.label}</Text>
                  <MaterialIcons name="arrow-back-ios" size={16} color={Colors.textLight} />
                </Pressable>
              ))}
            </View>
            <View style={styles.readyBox}>
              <MaterialIcons name="check-circle" size={24} color={Colors.success} />
              <Text style={styles.readyText}>أنت جاهز! لوحة التحكم جاهزة للاستخدام</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.stepCounter}>{step} / {TOTAL_STEPS}</Text>
          <Text style={styles.headerTitle}>إعداد حسابك</Text>
          <Pressable onPress={() => router.replace('/(business)')}>
            <Text style={styles.skipText}>تخطي</Text>
          </Pressable>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
        </View>
        <View style={styles.stepDots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View key={i} style={[styles.dot, i < step && styles.dotActive, i === step - 1 && styles.dotCurrent]} />
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        {step > 1 ? (
          <Pressable style={styles.prevBtn} onPress={() => setStep(s => s - 1)}>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.primary} />
            <Text style={styles.prevBtnText}>السابق</Text>
          </Pressable>
        ) : <View style={{ flex: 1 }} />}
        <Pressable style={styles.nextBtn} onPress={next} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.nextBtnText}>{step === TOTAL_STEPS ? 'ابدأ الآن!' : 'التالي'}</Text>
              <MaterialIcons name={step === TOTAL_STEPS ? 'rocket-launch' : 'arrow-back'} size={20} color={Colors.white} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  stepCounter: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  headerTitle: { color: Colors.white, fontSize: 17, ...Fonts.bold },
  skipText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 12 },
  progressFill: { height: 4, backgroundColor: Colors.gold, borderRadius: 2 },
  stepDots: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: 'rgba(255,255,255,0.6)' },
  dotCurrent: { backgroundColor: Colors.gold, width: 20 },
  scroll: { flex: 1 },
  stepContent: { padding: Spacing.lg },
  stepTitle: { fontSize: 24, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 6 },
  stepDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'right', marginBottom: Spacing.lg, lineHeight: 22 },
  field: { marginBottom: Spacing.md },
  label: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 8 },
  input: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text },
  textarea: { height: 90, textAlignVertical: 'top' },
  categoryRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: 8 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  categoryChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryChipText: { fontSize: 13, color: Colors.textSecondary, ...Fonts.medium },
  categoryChipTextActive: { color: Colors.white },
  planCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border, ...Shadows.small },
  planCardSelected: { borderColor: Colors.gold, backgroundColor: '#FFFDF5' },
  planCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  planRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  planRadioActive: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.gold },
  planCardName: { fontSize: 17, ...Fonts.bold, color: Colors.text },
  planCardPrice: { fontSize: 13, color: Colors.textSecondary },
  popularTag: { backgroundColor: Colors.gold, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  popularTagText: { color: Colors.white, fontSize: 11, ...Fonts.bold },
  planCardFeature: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right', marginBottom: 8 },
  trialTag: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  trialTagText: { fontSize: 12, color: Colors.gold, ...Fonts.semiBold },
  loyaltyTypes: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  loyaltyType: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', ...Shadows.small },
  loyaltyTypeActive: { borderColor: Colors.primary, backgroundColor: '#F0F4FF' },
  loyaltyIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  loyaltyLabel: { fontSize: 13, ...Fonts.bold, color: Colors.text, textAlign: 'center', marginBottom: 4 },
  loyaltyLabelActive: { color: Colors.primary },
  loyaltyDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', lineHeight: 16 },
  rewardPreview: { alignItems: 'center', marginBottom: Spacing.lg, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.xl, ...Shadows.small },
  rewardIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  rewardHint: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  tipBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FEF3C7', borderRadius: BorderRadius.md, padding: Spacing.md },
  tipText: { flex: 1, fontSize: 13, color: Colors.goldDark, textAlign: 'right', lineHeight: 20 },
  shareOptions: { gap: 10, marginBottom: Spacing.lg },
  shareOption: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.small },
  shareIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  shareLabel: { flex: 1, fontSize: 15, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  readyBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.successLight, borderRadius: BorderRadius.md, padding: Spacing.md },
  readyText: { flex: 1, fontSize: 14, color: Colors.success, ...Fonts.semiBold, textAlign: 'right' },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: Spacing.lg, paddingTop: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  prevBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.border },
  prevBtnText: { fontSize: 16, ...Fonts.semiBold, color: Colors.primary },
  nextBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 52, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, ...Shadows.medium },
  nextBtnText: { fontSize: 17, ...Fonts.bold, color: Colors.white },
});
