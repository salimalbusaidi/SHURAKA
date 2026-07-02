// Powered by OnSpace.AI - Root Layout
import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
import OfflineBanner from '@/components/layout/OfflineBanner';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <BusinessProvider>
            <OfflineBanner />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_left' }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(business)" />
              <Stack.Screen name="(customer)" />
              <Stack.Screen name="(admin)" />
              <Stack.Screen name="(legal)" />
              <Stack.Screen name="wallet" />
            </Stack>
          </BusinessProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
