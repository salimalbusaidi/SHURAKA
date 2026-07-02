// Powered by OnSpace.AI
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';

export default function ReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { reviews } = useBusiness();
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()}><MaterialIcons name="arrow-forward" size={24} color={Colors.white} /></Pressable>
        <Text style={styles.headerTitle}>تقييمات العملاء</Text>
        <View style={{ width: 32 }} />
      </LinearGradient>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.avgScore}>{avg}</Text>
        <View style={styles.stars}>
          {[1,2,3,4,5].map(s => (
            <MaterialIcons key={s} name="star" size={24} color={parseFloat(avg) >= s ? Colors.gold : Colors.gray200} />
          ))}
        </View>
        <Text style={styles.totalReviews}>بناءً على {reviews.length} تقييم</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }}>
        {reviews.map(r => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => (
                  <MaterialIcons key={s} name="star" size={16} color={r.rating >= s ? Colors.gold : Colors.gray200} />
                ))}
              </View>
              <View style={styles.reviewerInfo}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{r.customer.charAt(0)}</Text></View>
                <View>
                  <Text style={styles.reviewerName}>{r.customer}</Text>
                  <Text style={styles.reviewMeta}>{r.branch} · {r.date}</Text>
                </View>
              </View>
            </View>
            {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: 16 },
  headerTitle: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  summary: { backgroundColor: Colors.white, padding: Spacing.xl, alignItems: 'center', ...Shadows.small },
  avgScore: { fontSize: 64, ...Fonts.extraBold, color: Colors.text, lineHeight: 72 },
  stars: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  totalReviews: { fontSize: 13, color: Colors.textSecondary },
  reviewCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 10, ...Shadows.small },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  reviewerName: { fontSize: 15, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  reviewMeta: { fontSize: 12, color: Colors.textSecondary },
  reviewComment: { fontSize: 14, color: Colors.text, textAlign: 'right', lineHeight: 22, backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, padding: 10 },
});
