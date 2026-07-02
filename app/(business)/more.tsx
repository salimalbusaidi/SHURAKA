// Powered by OnSpace.AI - More Menu (real auth logout)
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useAlert } from '@/template';

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { business } = useBusiness();
  const { showAlert } = useAlert();

  const menuGroups = [
    {
      title: 'الإدارة',
      items: [
        { icon: 'people-outline', label: 'الموظفون', route: '/(business)/employees', color: '#6366F1' },
        { icon: 'store', label: 'الفروع', route: '/(business)/branches', color: '#10B981' },
        { icon: 'settings', label: 'إعدادات النشاط', route: '/(business)/settings', color: Colors.primary },
      ],
    },
    {
      title: 'التسويق',
      items: [
        { icon: 'campaign', label: 'العروض والإشعارات', route: '/(business)/offers', color: '#F59E0B' },
        { icon: 'star-rate', label: 'التقييمات', route: '/(business)/reviews', color: '#EF4444' },
        { icon: 'bar-chart', label: 'التقارير والتحليلات', route: '/(business)/reports', color: '#8B5CF6' },
      ],
    },
    {
      title: 'الحساب',
      items: [
        { icon: 'card-membership', label: 'الاشتراك والفوترة', route: '/(business)/subscription', color: Colors.gold },
        { icon: 'privacy-tip', label: 'سياسة الخصوصية', route: '/(legal)/privacy-policy', color: Colors.info },
        { icon: 'info', label: 'عن التطبيق', route: '/(legal)/about', color: Colors.textSecondary },
        { icon: 'help-outline', label: 'المساعدة والدعم', route: null, color: Colors.primary },
      ],
    },
  ];

  const handleLogout = () => {
    showAlert('تسجيل الخروج', 'هل تريد تسجيل الخروج من حسابك؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تسجيل الخروج', style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/');
        }
      },
    ]);
  };

  const planLabel = () => {
    const slug = business?.plan_slug || 'starter';
    if (slug === 'growth') return 'نمو';
    if (slug === 'partners_plus') return 'شركاء بلس';
    return 'انطلاقة';
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={[styles.profile, { paddingTop: insets.top + 16 }]}>
        <View style={styles.profileContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'م'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.profileBusiness}>{business?.business_name || 'لا يوجد نشاط تجاري'}</Text>
            <View style={styles.planChip}>
              <MaterialIcons name="diamond" size={12} color={Colors.gold} />
              <Text style={styles.planChipText}>باقة {planLabel()}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {menuGroups.map(group => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, i) => (
                <Pressable
                  key={i}
                  style={[styles.menuItem, i < group.items.length - 1 && styles.menuItemBorder]}
                  onPress={() => item.route ? router.push(item.route as any) : showAlert('قريبًا', 'هذه الخاصية قادمة قريبًا')}
                >
                  <MaterialIcons name="arrow-back-ios" size={16} color={Colors.textLight} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.group}>
          <View style={styles.groupCard}>
            <Pressable style={styles.menuItem} onPress={handleLogout}>
              <MaterialIcons name="arrow-back-ios" size={16} color={Colors.error} />
              <Text style={[styles.menuLabel, { color: Colors.error }]}>تسجيل الخروج</Text>
              <View style={[styles.menuIcon, { backgroundColor: Colors.errorLight }]}>
                <MaterialIcons name="logout" size={22} color={Colors.error} />
              </View>
            </Pressable>
          </View>
        </View>

        <Text style={styles.version}>شركاء v2.0 - جميع الحقوق محفوظة © 2025</Text>
        <Text style={styles.userId}>المعرف: {user?.id?.slice(0, 8)}...</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  profile: { paddingHorizontal: Spacing.lg, paddingBottom: 24 },
  profileContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', ...Shadows.gold },
  avatarText: { color: Colors.white, fontSize: 28, ...Fonts.bold },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.white, fontSize: 20, ...Fonts.bold, textAlign: 'right' },
  profileEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'right', marginBottom: 2 },
  profileBusiness: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'right', marginBottom: 6 },
  planChip: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', backgroundColor: 'rgba(201,168,76,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  planChipText: { color: Colors.goldLight, fontSize: 12, ...Fonts.semiBold },
  group: { paddingHorizontal: Spacing.md, marginTop: Spacing.md },
  groupTitle: { fontSize: 13, color: Colors.textSecondary, ...Fonts.semiBold, textAlign: 'right', marginBottom: 8 },
  groupCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, ...Shadows.small, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 16, ...Fonts.semiBold, color: Colors.text, textAlign: 'right' },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textLight, marginTop: Spacing.lg, marginBottom: 4 },
  userId: { textAlign: 'center', fontSize: 11, color: Colors.gray300, marginBottom: 8 },
});
