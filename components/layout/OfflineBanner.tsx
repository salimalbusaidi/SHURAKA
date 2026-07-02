// Powered by OnSpace.AI - Offline Banner Component
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function OfflineBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <MaterialIcons name="wifi-off" size={18} color={Colors.white} />
      <Text style={styles.text}>لا يوجد اتصال بالإنترنت — بعض الميزات قد لا تعمل</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  text: {
    color: Colors.white,
    fontSize: 13,
    ...Fonts.semiBold,
    textAlign: 'center',
  },
});
