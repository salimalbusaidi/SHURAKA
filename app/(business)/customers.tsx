// Powered by OnSpace.AI - Customers Screen (Web-optimized)
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Modal, KeyboardAvoidingView, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useBusiness } from '@/hooks/useBusiness';
import { useResponsive } from '@/hooks/useResponsive';
import { TopBar } from '@/components/layout/TopBar';
import WebTopBar from '@/components/layout/WebTopBar';
import { Badge } from '@/components/ui/Badge';
import { useAlert } from '@/template';

export default function CustomersScreen() {
  const router = useRouter();
  const { customers, addCustomer } = useBusiness();
  const { showAlert } = useAlert();
  const { isDesktop, isTablet, contentPadding } = useResponsive();
  const isWeb = Platform.OS === 'web' && (isDesktop || isTablet);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', birthday: '' });

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'active', label: 'نشط' },
    { id: 'inactive', label: 'غير نشط' },
    { id: 'top', label: 'الأكثر ولاءً' },
  ];

  const filtered = customers.filter(c => {
    const matchSearch = c.name.includes(search) || c.phone.includes(search);
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && c.status === 'active') ||
      (filter === 'inactive' && c.status === 'inactive') ||
      (filter === 'top' && c.points > 400);
    return matchSearch && matchFilter;
  });

  const tierColors: Record<string, any> = {
    'بلاتيني': 'gold', 'ذهبي': 'warning', 'فضي': 'info', 'برونزي': 'default',
  };

  const handleAdd = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      showAlert('', 'الاسم ورقم الهاتف مطلوبان');
      return;
    }
    addCustomer(newCustomer);
    setNewCustomer({ name: '', phone: '', email: '', birthday: '' });
    setShowAdd(false);
    showAlert('تم الإضافة', `تمت إضافة ${newCustomer.name} بنجاح`);
  };

  return (
    <View style={styles.container}>
      {isWeb ? <WebTopBar title={`العملاء (${customers.length})`} /> : <TopBar />}

      <View style={[styles.header, isWeb && { paddingHorizontal: contentPadding }]}>
        <View style={styles.headerTop}>
          <Pressable style={styles.addBtn} onPress={() => setShowAdd(true)}>
            <MaterialIcons name="person-add" size={18} color={Colors.white} />
            <Text style={styles.addBtnText}>إضافة عميل</Text>
          </Pressable>
          {!isWeb ? <Text style={styles.headerTitle}>العملاء ({customers.length})</Text> : null}
        </View>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="البحث بالاسم أو الهاتف"
            value={search}
            onChangeText={setSearch}
            textAlign="right"
            placeholderTextColor={Colors.textLight}
          />
          <MaterialIcons name="search" size={22} color={Colors.textSecondary} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {filters.map(f => (
              <Pressable
                key={f.id}
                style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
                onPress={() => setFilter(f.id)}
              >
                <Text style={[styles.filterChipText, filter === f.id && styles.filterChipTextActive]}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: contentPadding, paddingBottom: 20 }}
      >
        <View style={isWeb ? styles.gridLayout : undefined}>
          {filtered.map(c => (
            <Pressable
              key={c.id}
              style={[styles.customerCard, isWeb && styles.customerCardWeb]}
              onPress={() => router.push(`/(business)/wallet/${c.id}` as any)}
            >
              <View style={styles.customerLeft}>
                <MaterialIcons name="arrow-back-ios" size={16} color={Colors.textLight} />
              </View>
              <View style={styles.customerInfo}>
                <View style={styles.customerNameRow}>
                  <Badge label={c.tier} variant={tierColors[c.tier] || 'default'} size="sm" />
                  <Text style={styles.customerName}>{c.name}</Text>
                </View>
                <Text style={styles.customerPhone}>{c.phone}</Text>
                <View style={styles.customerStats}>
                  <View style={styles.customerStat}>
                    <Text style={styles.customerStatValue}>{c.stamps}/10</Text>
                    <Text style={styles.customerStatLabel}>طوابع</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.customerStat}>
                    <Text style={styles.customerStatValue}>{c.points}</Text>
                    <Text style={styles.customerStatLabel}>نقطة</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.customerStat}>
                    <Text style={styles.customerStatValue}>{c.total_visits}</Text>
                    <Text style={styles.customerStatLabel}>زيارة</Text>
                  </View>
                </View>
              </View>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerAvatarText}>{c.name.charAt(0)}</Text>
                {c.status === 'active' ? <View style={styles.activeDot} /> : null}
              </View>
            </Pressable>
          ))}
        </View>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="people-outline" size={60} color={Colors.gray300} />
            <Text style={styles.emptyTitle}>لا يوجد عملاء</Text>
            <Text style={styles.emptyDesc}>ابدأ بإضافة أول عميل لك</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Add Customer Modal */}
      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.modalCard, isWeb && styles.modalCardWeb]}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setShowAdd(false)}>
                  <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
                </Pressable>
                <Text style={styles.modalTitle}>إضافة عميل جديد</Text>
              </View>
              {[
                { key: 'name', label: 'الاسم الكامل *', placeholder: 'اسم العميل', type: 'default' as const },
                { key: 'phone', label: 'رقم الهاتف *', placeholder: '+968 9xxx xxxx', type: 'phone-pad' as const },
                { key: 'email', label: 'البريد الإلكتروني', placeholder: 'example@email.com', type: 'email-address' as const },
                { key: 'birthday', label: 'تاريخ الميلاد', placeholder: 'YYYY-MM-DD', type: 'default' as const },
              ].map(field => (
                <View key={field.key} style={styles.modalField}>
                  <Text style={styles.modalLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder={field.placeholder}
                    value={newCustomer[field.key as keyof typeof newCustomer]}
                    onChangeText={v => setNewCustomer(p => ({ ...p, [field.key]: v }))}
                    keyboardType={field.type}
                    textAlign="right"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
              ))}
              <Pressable style={styles.modalBtn} onPress={handleAdd}>
                <Text style={styles.modalBtnText}>إضافة العميل</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: { backgroundColor: Colors.white, padding: Spacing.md, ...Shadows.small },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  headerTitle: { fontSize: 20, ...Fonts.bold, color: Colors.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.md },
  addBtnText: { color: Colors.white, fontSize: 14, ...Fonts.semiBold },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, height: 44, gap: 8, marginBottom: Spacing.sm },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filtersRow: { flexDirection: 'row', paddingBottom: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8, backgroundColor: Colors.white },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, color: Colors.textSecondary, ...Fonts.medium },
  filterChipTextActive: { color: Colors.white },
  list: { flex: 1 },
  gridLayout: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  customerCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 10, ...Shadows.small, alignItems: 'center', gap: 12 },
  customerCardWeb: { flex: 1, minWidth: 280, maxWidth: '48%', marginBottom: 0 },
  customerLeft: { padding: 4 },
  customerInfo: { flex: 1 },
  customerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, justifyContent: 'flex-end' },
  customerName: { fontSize: 16, ...Fonts.bold, color: Colors.text },
  customerPhone: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', marginBottom: 8 },
  customerStats: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  customerStat: { alignItems: 'center' },
  customerStatValue: { fontSize: 15, ...Fonts.bold, color: Colors.primary },
  customerStatLabel: { fontSize: 10, color: Colors.textSecondary },
  divider: { width: 1, height: 24, backgroundColor: Colors.border },
  customerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  customerAvatarText: { color: Colors.white, fontSize: 20, ...Fonts.bold },
  activeDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.white },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, ...Fonts.bold, color: Colors.textSecondary },
  emptyDesc: { fontSize: 14, color: Colors.textLight },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end', alignItems: Platform.OS === 'web' ? 'center' : 'stretch' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg },
  modalCardWeb: { borderRadius: 24, width: 480, maxWidth: '90%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  modalTitle: { fontSize: 20, ...Fonts.bold, color: Colors.text },
  modalField: { marginBottom: Spacing.md },
  modalLabel: { fontSize: 14, ...Fonts.semiBold, color: Colors.text, textAlign: 'right', marginBottom: 6 },
  modalInput: { backgroundColor: Colors.gray50, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text },
  modalBtn: { backgroundColor: Colors.primary, height: 52, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  modalBtnText: { color: Colors.white, fontSize: 17, ...Fonts.bold },
});
