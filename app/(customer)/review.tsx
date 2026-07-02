// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAlert } from '@/template';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating) { showAlert('', 'يرجى اختيار تقييم'); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.headerTitle}>تقييمك</Text>
        </LinearGradient>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={80} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>شكرًا على تقييمك! 🙏</Text>
          <Text style={styles.successDesc}>رأيك يساعدنا على تقديم خدمة أفضل دائمًا</Text>
          <View style={styles.starsDisplay}>
            {[1,2,3,4,5].map(s => (
              <MaterialIcons key={s} name="star" size={32} color={rating >= s ? Colors.gold : Colors.gray200} />
            ))}
          </View>
          <Pressable style={styles.resetBtn} onPress={() => { setRating(0); setComment(''); setSubmitted(false); }}>
            <Text style={styles.resetBtnText}>إضافة تقييم جديد</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>قيّم تجربتك</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 20 }}>
        <View style={styles.ratingCard}>
          <Text style={styles.ratingPrompt}>كيف كانت تجربتك اليوم؟</Text>
          <Text style={styles.ratingSubPrompt}>آخر زيارة لـ مقهى السعادة</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(s => (
              <Pressable key={s} onPress={() => setRating(s)}>
                <MaterialIcons name="star" size={52} color={rating >= s ? Colors.gold : Colors.gray200} />
              </Pressable>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'اضغط لاختيار التقييم' : ['', 'سيء جدًا 😞', 'سيء 😐', 'جيد 🙂', 'جيد جدًا 😊', 'ممتاز! 🤩'][rating]}
          </Text>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>أضف تعليقك (اختياري)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="شاركنا تجربتك وأي اقتراحات لتحسين الخدمة..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlign="right"
            textAlignVertical="top"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        <Pressable
          style={[styles.submitBtn, !rating && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!rating}
        >
          <MaterialIcons name="send" size={20} color={Colors.white} />
          <Text style={styles.submitBtnText}>إرسال التقييم</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold, textAlign: 'right' },
  ratingCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.lg, ...Shadows.medium },
  ratingPrompt: { fontSize: 22, ...Fonts.bold, color: Colors.text, textAlign: 'center', marginBottom: 4 },
  ratingSubPrompt: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  ratingLabel: { fontSize: 16, color: Colors.textSecondary, ...Fonts.medium },
  commentSection: { marginBottom: Spacing.lg },
  commentLabel: { fontSize: 15, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 10 },
  commentInput: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.md, fontSize: 15, color: Colors.text, minHeight: 120, ...Shadows.small },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.xl, ...Shadows.medium },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: Colors.white, fontSize: 18, ...Fonts.bold },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: 16 },
  successIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.successLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 26, ...Fonts.bold, color: Colors.text, textAlign: 'center' },
  successDesc: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  starsDisplay: { flexDirection: 'row', gap: 6 },
  resetBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.primary },
  resetBtnText: { color: Colors.primary, fontSize: 15, ...Fonts.semiBold },
});
