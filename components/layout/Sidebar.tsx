// Powered by OnSpace.AI - Web Sidebar Navigation
import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useResponsive } from '@/hooks/useResponsive';
import { useAlert } from '@/template';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

const BUSINESS_NAV: NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/(business)' },
  { icon: 'people', label: 'العملاء', route: '/(business)/customers' },
  { icon: 'card-giftcard', label: 'برامج الولاء', route: '/(business)/loyalty' },
  { icon: 'qr-code-scanner', label: 'مسح QR', route: '/(business)/scanner' },
  { icon: 'badge', label: 'الموظفون', route: '/(business)/employees' },
  { icon: 'store', label: 'الفروع', route: '/(business)/branches' },
  { icon: 'campaign', label: 'العروض والإشعارات', route: '/(business)/offers' },
  { icon: 'star', label: 'التقييمات', route: '/(business)/reviews' },
  { icon: 'bar-chart', label: 'التقارير', route: '/(business)/reports' },
  { icon: 'credit-card', label: 'الاشتراك', route: '/(business)/subscription' },
  { icon: 'settings', label: 'الإعدادات', route: '/(business)/settings' },
];

const ADMIN_NAV: NavItem[] = [
  { icon: 'admin-panel-settings', label: 'لوحة المدير', route: '/(admin)' },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { business } = useBusiness();
  const { isDesktop, isTablet } = useResponsive();
  const { showAlert } = useAlert();

  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV : BUSINESS_NAV;
  const showLabels = isDesktop && !collapsed;

  const isActive = (route: string) => {
    if (route === '/(business)') return pathname === '/(business)' || pathname === '/';
    return pathname.includes(route.replace('/(business)/', '').replace('/(admin)/', ''));
  };

  const handleLogout = () => {
    showAlert('تسجيل الخروج', 'هل أنت متأكد من تسجيل الخروج؟', [
      { text: 'تأكيد', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login' as any); } },
      { text: 'إلغاء', style: 'cancel' },
    ]);
  };

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryLight]}
      style={[styles.sidebar, { width: showLabels ? 240 : 72 }]}
    >
      {/* Logo */}
      <View style={[styles.logoArea, !showLabels && styles.logoAreaCollapsed]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>ش</Text>
        </View>
        {showLabels ? (
          <View style={styles.logoText}>
            <Text style={styles.logoName}>شركاء</Text>
            <Text style={styles.logoTagline} numberOfLines={1}>{business?.business_name || 'منصة الولاء'}</Text>
          </View>
        ) : null}
        {isDesktop && onCollapse ? (
          <Pressable onPress={onCollapse} style={styles.collapseBtn}>
            <MaterialIcons name={collapsed ? 'chevron-left' : 'chevron-right'} size={18} color="rgba(255,255,255,0.5)" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.divider} />

      {/* Nav Items */}
      <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
        {navItems.map((item) => {
          const active = isActive(item.route);
          return (
            <Pressable
              key={item.route}
              style={[styles.navItem, active && styles.navItemActive, !showLabels && styles.navItemCollapsed]}
              onPress={() => router.push(item.route as any)}
            >
              {active ? (
                <View style={styles.activeIndicator} />
              ) : null}
              <View style={[styles.navIconWrap, active && styles.navIconActive]}>
                <MaterialIcons
                  name={item.icon as any}
                  size={22}
                  color={active ? Colors.gold : 'rgba(255,255,255,0.65)'}
                />
              </View>
              {showLabels ? (
                <Text style={[styles.navLabel, active && styles.navLabelActive]} numberOfLines={1}>
                  {item.label}
                </Text>
              ) : null}
              {item.badge && showLabels ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.divider} />

      {/* User + Logout */}
      <View style={[styles.userArea, !showLabels && styles.userAreaCollapsed]}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{user?.name?.charAt(0) || 'م'}</Text>
        </View>
        {showLabels ? (
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>{user?.name}</Text>
            <Text style={styles.userRole}>{user?.role === 'admin' ? 'مدير النظام' : 'صاحب عمل'}</Text>
          </View>
        ) : null}
        <Pressable onPress={handleLogout} style={styles.logoutBtn} hitSlop={8}>
          <MaterialIcons name="logout" size={20} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    flexDirection: 'column',
    paddingVertical: Spacing.md,
    overflow: 'hidden',
  } as any,
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: 10,
  },
  logoAreaCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoLetter: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  logoText: { flex: 1 },
  logoName: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  logoTagline: { color: Colors.goldLight, fontSize: 11, fontWeight: '400' },
  collapseBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: Spacing.md, marginVertical: 4 },
  navScroll: { flex: 1 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: BorderRadius.md,
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginHorizontal: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(201, 168, 76, 0.12)',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.gold,
  },
  navIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  navIconActive: {
    backgroundColor: 'rgba(201, 168, 76, 0.15)',
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    textAlign: 'right',
  },
  navLabelActive: { color: Colors.gold, fontWeight: '700' },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: 10,
  },
  userAreaCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    flexDirection: 'column',
    gap: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userAvatarText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  userInfo: { flex: 1 },
  userName: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  userRole: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  logoutBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
