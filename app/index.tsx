// Powered by OnSpace.AI - Root: redirect to login or dashboard
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';

export default function RootIndex() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user) {
      if (user.role === 'admin') router.replace('/(admin)' as any);
      else if (user.role === 'customer') router.replace('/(customer)' as any);
      else if (user.role === 'employee') router.replace('/(business)/scanner' as any);
      else router.replace('/(business)' as any);
    } else {
      router.replace('/(auth)/login' as any);
    }
  }, [isAuthenticated, isLoading, user]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary }}>
      <ActivityIndicator size="large" color={Colors.gold} />
    </View>
  );
}
