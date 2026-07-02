// Powered by OnSpace.AI - Web Top Bar for desktop layout
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useAlert } from '@/template';

interface WebTopBarProps {
  title?: string;
  showBack?: boolean;
}

export default function WebTopBar({ title, showBack = false }: WebTopBarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { business } = useBusiness();
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('تسجيل الخروج', 'هل أنت متأكد؟', [
      { text: 'تأكيد', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login' as any); } },
      { text: 'إلغاء', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.topBar}>
      <View style={styles.right}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={22} color={Colors.text} />
          </Pressable>
        ) : null}
        <View>
          {title ? <Text style={styles.pageTitle}>{title}</Text> : null}
          <Text style={styles.businessName}>{business?.business_name || 'شركاء'}</Text>
        </View>
      </View>
      <View style={styles.left}>
        <Pressable style={styles.iconBtn} onPress={() => router.push('/(business)/offers' as any)} hitSlop={8}>
          <MaterialIcons name="notifications-none" size={22} color={Colors.text} />
          <View style={styles.notifDot} />
        </Pressable>
        <Pressable
          style={styles.userChip}
          onPress={() => showAlert(user?.name || '', `${user?.email}\nالدور: ${user?.role === 'admin' ? 'مدير' : 'صاحب عمل'}`, [
            { text: 'تسجيل الخروج', style: 'destructive', onPress: handleLogout },
            { text: 'إغلاق', style: 'cancel' },
          ])}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'م'}</Text>
          </View>
          <Text style={styles.userName} numberOfLines={1}>{user?.name?.split(' ')[0]}</Text>
          <MaterialIcons name="expand-more" size={18} color={Colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.small,
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: { fontSize: 18, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  businessName: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  userName: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, maxWidth: 100 },
});
