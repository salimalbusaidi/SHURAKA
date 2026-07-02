// Powered by OnSpace.AI
import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Fonts, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';

interface UpsellModalProps {
  visible: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan?: string;
}

export function UpsellModal({ visible, onClose, feature, requiredPlan = 'نمو' }: UpsellModalProps) {
  const router = useRouter();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="lock" size={40} color={Colors.gold} />
          </View>
          <Text style={styles.title}>هذه الميزة متاحة في باقة أعلى</Text>
          <Text style={styles.subtitle}>
            ميزة "{feature}" متاحة في باقة{' '}
            <Text style={{ color: Colors.gold, ...Fonts.bold }}>{requiredPlan}</Text> أو أعلى.
          </Text>
          <Text style={styles.desc}>ترقّ الآن واستفد من ميزات متقدمة لتنمية أعمالك.</Text>
          <Pressable
            style={styles.upgradeBtn}
            onPress={() => { onClose(); router.push('/(business)/subscription'); }}
          >
            <MaterialIcons name="rocket-launch" size={18} color={Colors.white} />
            <Text style={styles.upgradeBtnText}>ترقية الباقة الآن</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>ليس الآن</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.xl, width: '100%', maxWidth: 360, alignItems: 'center' },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  title: { fontSize: 20, ...Fonts.bold, color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.sm },
  desc: { fontSize: 13, color: Colors.textLight, textAlign: 'center', marginBottom: Spacing.lg },
  upgradeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.gold, paddingVertical: 14, paddingHorizontal: 28, borderRadius: BorderRadius.lg, width: '100%', justifyContent: 'center', marginBottom: Spacing.sm },
  upgradeBtnText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  cancelBtn: { paddingVertical: 10 },
  cancelText: { color: Colors.textSecondary, fontSize: 14 },
});
