// Powered by OnSpace.AI
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useRouter } from 'expo-router';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightAction?: () => void;
  rightIcon?: string;
}

export function TopBar({ title, showBack, rightAction, rightIcon }: TopBarProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { business } = useBusiness();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'android' ? 8 : 4) }]}>
      <View style={styles.inner}>
        {showBack ? (
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-forward" size={24} color={Colors.white} />
          </Pressable>
        ) : (
          <View style={styles.brandArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>ش</Text>
            </View>
            <View>
              <Text style={styles.brandName}>{business?.business_name || 'شركاء'}</Text>
              <Text style={styles.planBadge}>باقة {business?.subscription_plan === 'growth' ? 'نمو' : business?.subscription_plan === 'plus' ? 'شركاء بلس' : 'انطلاقة'}</Text>
            </View>
          </View>
        )}

        {title ? <Text style={styles.title}>{title}</Text> : null}

        <View style={styles.actions}>
          <Pressable style={styles.iconBtn} onPress={() => {}}>
            <View style={styles.notifDot} />
            <MaterialIcons name="notifications-none" size={24} color={Colors.white} />
          </Pressable>
          <Pressable style={styles.avatarBtn} onPress={() => {}}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'م'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.primary, paddingBottom: 12 },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md },
  brandArea: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: Colors.white, fontSize: 18, ...Fonts.bold },
  brandName: { color: Colors.white, fontSize: 15, ...Fonts.bold },
  planBadge: { color: Colors.goldLight, fontSize: 11, ...Fonts.medium },
  title: { color: Colors.white, fontSize: 17, ...Fonts.bold, flex: 1, textAlign: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 4, position: 'relative' },
  notifDot: { position: 'absolute', top: 2, left: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error, zIndex: 1 },
  avatarBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontSize: 15, ...Fonts.bold },
});
