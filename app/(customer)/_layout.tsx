// Powered by OnSpace.AI - Customer Route Guard
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function CustomerLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }
    // Redirect non-customers
    if (user?.role === 'admin') {
      router.replace('/(admin)');
      return;
    }
    if (user?.role === 'business_owner' || user?.role === 'employee') {
      router.replace('/(business)');
      return;
    }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!isAuthenticated) return null;

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 65 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: { fontSize: 11, ...Fonts.medium },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'محفظتي', tabBarIcon: ({ color, size }) => <MaterialIcons name="account-balance-wallet" size={size} color={color} /> }} />
      <Tabs.Screen name="offers" options={{ title: 'العروض', tabBarIcon: ({ color, size }) => <MaterialIcons name="local-offer" size={size} color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: 'السجل', tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} /> }} />
      <Tabs.Screen name="review" options={{ title: 'تقييم', tabBarIcon: ({ color, size }) => <MaterialIcons name="star-rate" size={size} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
});
