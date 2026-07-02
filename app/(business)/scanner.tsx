// Powered by OnSpace.AI - QR Scanner Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { useAlert } from '@/template';

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const { customers, addStamp, addPoints, redeemReward, addTransaction } = useBusiness();
  const { showAlert } = useAlert();
  const [scanning, setScanning] = useState(false);
  const [scannedCustomer, setScannedCustomer] = useState<typeof customers[0] | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [pointsInput, setPointsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      setScannedCustomer(randomCustomer);
      setScanning(false);
    }, 1500);
  };

  const handleAction = (actionType: string) => {
    if (!scannedCustomer) return;
    if (actionType === 'stamp') {
      addStamp(scannedCustomer.id, 1);
      addTransaction({ customer_name: scannedCustomer.name, type: 'stamp', value: '+1 طابع', employee: 'الموظف الحالي', branch: 'الفرع الرئيسي' });
      setSuccess(true);
      setAction('stamp_done');
    } else if (actionType === 'points') {
      if (!pointsInput) { showAlert('', 'يرجى إدخال عدد النقاط'); return; }
      addPoints(scannedCustomer.id, parseInt(pointsInput));
      addTransaction({ customer_name: scannedCustomer.name, type: 'points', value: `+${pointsInput} نقطة`, employee: 'الموظف الحالي', branch: 'الفرع الرئيسي' });
      setSuccess(true);
      setAction('points_done');
    } else if (actionType === 'redeem') {
      redeemReward(scannedCustomer.id);
      addTransaction({ customer_name: scannedCustomer.name, type: 'reward', value: 'مكافأة مستبدلة', employee: 'الموظف الحالي', branch: 'الفرع الرئيسي' });
      setSuccess(true);
      setAction('redeem_done');
    }
  };

  const reset = () => {
    setScannedCustomer(null);
    setAction(null);
    setSuccess(false);
    setPointsInput('');
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>مسح QR Code</Text>
        <Text style={styles.headerSub}>امسح رمز العميل لإضافة نقاط أو طوابع</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {!scannedCustomer ? (
          <View style={styles.scanArea}>
            {/* Scanner Simulation */}
            <View style={styles.scannerFrame}>
              {scanning ? (
                <View style={styles.scanningAnim}>
                  <View style={styles.scanLine} />
                  <MaterialIcons name="qr-code" size={80} color="rgba(201,168,76,0.4)" />
                  <Text style={styles.scanningText}>جاري المسح...</Text>
                </View>
              ) : (
                <View style={styles.scanIdle}>
                  <MaterialIcons name="qr-code-scanner" size={80} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.scanIdleText}>وجّه الكاميرا نحو{'\n'}رمز QR الخاص بالعميل</Text>
                </View>
              )}
              {/* Corner marks */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>

            <Pressable style={styles.scanBtn} onPress={simulateScan} disabled={scanning}>
              <MaterialIcons name={scanning ? 'hourglass-empty' : 'qr-code-scanner'} size={24} color={Colors.white} />
              <Text style={styles.scanBtnText}>{scanning ? 'جاري المسح...' : 'بدء المسح'}</Text>
            </Pressable>

            <Text style={styles.orText}>— أو ابحث عن العميل مباشرة —</Text>

            <ScrollView style={styles.quickCustomers} horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: Spacing.lg }}>
                {customers.slice(0, 6).map(c => (
                  <Pressable key={c.id} style={styles.quickCustomerBtn} onPress={() => setScannedCustomer(c)}>
                    <View style={styles.quickCustomerAvatar}>
                      <Text style={styles.quickCustomerAvatarText}>{c.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.quickCustomerName} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : success ? (
          <View style={styles.successArea}>
            <View style={styles.successIcon}>
              <MaterialIcons name="check-circle" size={80} color={Colors.success} />
            </View>
            <Text style={styles.successTitle}>
              {action === 'stamp_done' ? 'تم إضافة الطابع!' : action === 'points_done' ? `تم إضافة ${pointsInput} نقطة!` : 'تم استبدال المكافأة!'}
            </Text>
            <Text style={styles.successCustomer}>{scannedCustomer.name}</Text>
            <View style={styles.successStats}>
              <View style={styles.successStat}>
                <Text style={styles.successStatValue}>{scannedCustomer.stamps}</Text>
                <Text style={styles.successStatLabel}>طوابع</Text>
              </View>
              <View style={styles.successStat}>
                <Text style={styles.successStatValue}>{scannedCustomer.points}</Text>
                <Text style={styles.successStatLabel}>نقاط</Text>
              </View>
            </View>
            <Pressable style={styles.newScanBtn} onPress={reset}>
              <MaterialIcons name="qr-code-scanner" size={20} color={Colors.white} />
              <Text style={styles.newScanBtnText}>مسح جديد</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.customerCard}>
            <View style={styles.customerCardHeader}>
              <Pressable onPress={reset} style={styles.closeBtn}>
                <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
              <View style={styles.customerInfo}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.customerAvatarText}>{scannedCustomer.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.customerName}>{scannedCustomer.name}</Text>
                  <Text style={styles.customerPhone}>{scannedCustomer.phone}</Text>
                  <Text style={styles.lastVisit}>آخر زيارة: {scannedCustomer.last_visit}</Text>
                </View>
              </View>
            </View>

            <View style={styles.customerStatsRow}>
              <View style={styles.customerStatBox}>
                <View style={styles.stampsDisplay}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <View key={i} style={[styles.stampCircle, i < scannedCustomer.stamps && styles.stampCircleFilled]}>
                      <MaterialIcons name="local-cafe" size={14} color={i < scannedCustomer.stamps ? Colors.white : Colors.gray300} />
                    </View>
                  ))}
                </View>
                <Text style={styles.stampsLabel}>{scannedCustomer.stamps}/10 طوابع</Text>
              </View>
              <View style={[styles.customerStatBox, { alignItems: 'flex-start' }]}>
                <Text style={styles.bigPoints}>{scannedCustomer.points}</Text>
                <Text style={styles.pointsLabel}>نقطة متاحة</Text>
                <Text style={styles.visitsLabel}>🏃 {scannedCustomer.total_visits} زيارة إجمالية</Text>
              </View>
            </View>

            <Text style={styles.actionsTitle}>اختر الإجراء</Text>
            <View style={styles.actionsGrid}>
              <Pressable style={styles.actionCard} onPress={() => handleAction('stamp')}>
                <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
                  <MaterialIcons name="local-cafe" size={28} color={Colors.primary} />
                </View>
                <Text style={styles.actionLabel}>إضافة طابع</Text>
              </Pressable>
              <Pressable style={styles.actionCard} onPress={() => setAction('points_input')}>
                <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialIcons name="star" size={28} color={Colors.gold} />
                </View>
                <Text style={styles.actionLabel}>إضافة نقاط</Text>
              </Pressable>
              <Pressable style={styles.actionCard} onPress={() => scannedCustomer.stamps >= 10 ? handleAction('redeem') : showAlert('', 'يحتاج العميل ١٠ طوابع للاستبدال')}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.successLight }]}>
                  <MaterialIcons name="card-giftcard" size={28} color={Colors.success} />
                </View>
                <Text style={styles.actionLabel}>استبدال مكافأة</Text>
              </Pressable>
              <Pressable style={styles.actionCard} onPress={() => setAction('note')}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.errorLight }]}>
                  <MaterialIcons name="note-add" size={28} color={Colors.error} />
                </View>
                <Text style={styles.actionLabel}>إضافة ملاحظة</Text>
              </Pressable>
            </View>

            {action === 'points_input' ? (
              <View style={styles.pointsInput}>
                <TextInput
                  style={styles.pointsInputField}
                  placeholder="عدد النقاط"
                  value={pointsInput}
                  onChangeText={setPointsInput}
                  keyboardType="number-pad"
                  textAlign="center"
                />
                <Pressable style={styles.pointsBtn} onPress={() => handleAction('points')}>
                  <Text style={styles.pointsBtnText}>تأكيد الإضافة</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: 24, alignItems: 'flex-end' },
  headerTitle: { color: Colors.white, fontSize: 24, ...Fonts.bold, marginBottom: 4 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  scroll: { flex: 1 },
  scanArea: { padding: Spacing.lg, alignItems: 'center' },
  scannerFrame: { width: 260, height: 260, borderRadius: BorderRadius.xl, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg, position: 'relative', overflow: 'hidden' },
  scanningAnim: { alignItems: 'center', justifyContent: 'center', gap: 16 },
  scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold, opacity: 0.8 },
  scanningText: { color: Colors.gold, fontSize: 14, ...Fonts.semiBold },
  scanIdle: { alignItems: 'center', gap: 12 },
  scanIdleText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: Colors.gold, borderWidth: 3 },
  cornerTL: { top: 12, left: 12, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 12, right: 12, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 12, left: 12, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 12, right: 12, borderLeftWidth: 0, borderTopWidth: 0 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.gold, paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, ...Shadows.gold },
  scanBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
  orText: { fontSize: 13, color: Colors.textSecondary, marginBottom: Spacing.md },
  quickCustomers: { width: '100%' },
  quickCustomerBtn: { alignItems: 'center', gap: 8, width: 72 },
  quickCustomerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  quickCustomerAvatarText: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  quickCustomerName: { fontSize: 12, color: Colors.text, ...Fonts.medium, textAlign: 'center' },
  customerCard: { margin: Spacing.md, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.medium },
  customerCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  closeBtn: { padding: 4 },
  customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  customerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  customerAvatarText: { color: Colors.white, fontSize: 22, ...Fonts.bold },
  customerName: { fontSize: 18, ...Fonts.bold, color: Colors.text, textAlign: 'right' },
  customerPhone: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  lastVisit: { fontSize: 12, color: Colors.textLight, textAlign: 'right' },
  customerStatsRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.lg },
  customerStatBox: { flex: 1, backgroundColor: Colors.gray50, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'flex-end' },
  stampsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end', marginBottom: 8 },
  stampCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: Colors.gray300, alignItems: 'center', justifyContent: 'center' },
  stampCircleFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stampsLabel: { fontSize: 12, color: Colors.textSecondary, ...Fonts.medium },
  bigPoints: { fontSize: 32, ...Fonts.extraBold, color: Colors.gold },
  pointsLabel: { fontSize: 12, color: Colors.textSecondary },
  visitsLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  actionsTitle: { fontSize: 17, ...Fonts.bold, color: Colors.text, textAlign: 'right', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { flex: 1, minWidth: '45%', backgroundColor: Colors.gray50, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border },
  actionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 14, ...Fonts.semiBold, color: Colors.text },
  pointsInput: { marginTop: Spacing.md, gap: 10 },
  pointsInputField: { backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.gold, padding: 14, fontSize: 20, color: Colors.text, textAlign: 'center' },
  pointsBtn: { backgroundColor: Colors.gold, padding: 14, borderRadius: BorderRadius.lg, alignItems: 'center' },
  pointsBtnText: { color: Colors.white, fontSize: 16, ...Fonts.bold },
  successArea: { padding: Spacing.xl, alignItems: 'center', gap: 16 },
  successIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.successLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 24, ...Fonts.bold, color: Colors.text },
  successCustomer: { fontSize: 16, color: Colors.textSecondary },
  successStats: { flexDirection: 'row', gap: 32 },
  successStat: { alignItems: 'center' },
  successStatValue: { fontSize: 28, ...Fonts.extraBold, color: Colors.primary },
  successStatLabel: { fontSize: 14, color: Colors.textSecondary },
  newScanBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.lg, marginTop: 8, ...Shadows.medium },
  newScanBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
});
