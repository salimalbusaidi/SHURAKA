// Powered by OnSpace.AI - Web-first Business Layout with Sidebar
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/useResponsive';
import Sidebar from '@/components/layout/Sidebar';

export default function BusinessLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, isTablet } = useResponsive();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace('/(auth)/login'); return; }
    if (user?.role === 'admin') { router.replace('/(admin)'); return; }
    if (user?.role === 'customer') { router.replace('/(customer)'); return; }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }
  if (!isAuthenticated) return null;

  // ── Desktop / Tablet: Sidebar layout ─────────────────────────
  if ((isDesktop || isTablet) && Platform.OS === 'web') {
    return (
      <View style={styles.webLayout}>
        <Sidebar
          collapsed={isTablet || sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(v => !v)}
        />
        <View style={styles.webContent}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' },
            }}
          >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="customers" />
            <Tabs.Screen name="scanner" />
            <Tabs.Screen name="loyalty" />
            <Tabs.Screen name="more" />
            <Tabs.Screen name="employees" />
            <Tabs.Screen name="branches" />
            <Tabs.Screen name="offers" />
            <Tabs.Screen name="reviews" />
            <Tabs.Screen name="reports" />
            <Tabs.Screen name="subscription" />
            <Tabs.Screen name="settings" />
            <Tabs.Screen name="wallet/[id]" />
          </Tabs>
        </View>
      </View>
    );
  }

  // ── Mobile: Bottom Tab Bar ─────────────────────────────────────
  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 64, android: insets.bottom + 64, default: 70 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: { fontSize: 11, ...Fonts.medium },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'الرئيسية', tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} /> }} />
      <Tabs.Screen name="customers" options={{ title: 'العملاء', tabBarIcon: ({ color, size }) => <MaterialIcons name="people" size={size} color={color} /> }} />
      <Tabs.Screen name="scanner" options={{ title: 'المسح', tabBarIcon: ({ color, size }) => (
        <View style={[styles.scannerTab, { backgroundColor: color === Colors.gold ? Colors.gold : Colors.primaryLight }]}>
          <MaterialIcons name="qr-code-scanner" size={26} color={Colors.white} />
        </View>
      )}} />
      <Tabs.Screen name="loyalty" options={{ title: 'الولاء', tabBarIcon: ({ color, size }) => <MaterialIcons name="card-giftcard" size={size} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: 'المزيد', tabBarIcon: ({ color, size }) => <MaterialIcons name="menu" size={size} color={color} /> }} />
      <Tabs.Screen name="employees" options={{ href: null }} />
      <Tabs.Screen name="branches" options={{ href: null }} />
      <Tabs.Screen name="offers" options={{ href: null }} />
      <Tabs.Screen name="reviews" options={{ href: null }} />
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="subscription" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="wallet/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  webLayout: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.offWhite,
  },
  webContent: {
    flex: 1,
    overflow: 'hidden',
  } as any,
  scannerTab: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4, ...Shadows.gold,
  },
});
