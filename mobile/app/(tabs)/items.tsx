import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { BASE_URL } from '../../constants/config';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';
import { ItemCard } from '../../components/ItemCard';

export default function ItemsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // QR Success Modal state
  const [createdItem, setCreatedItem] = useState<any>(null);
  const [showQRFor, setShowQRFor] = useState<any>(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await api.get<{ items: any[] }>('/items');
      setItems(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleCreate = async () => {
    if (!itemName.trim()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('itemName', itemName);
      if (description) formData.append('description', description);
      if (photo) {
        const ext = photo.split('.').pop() || 'jpg';
        formData.append('photo', { uri: photo, name: `photo.${ext}`, type: `image/${ext}` } as any);
      }
      const newItem = await api.post<any>('/items', formData);

      // Show QR immediately after creation
      setCreatedItem(newItem);

      setItemName('');
      setDescription('');
      setPhoto(null);
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    Alert.alert('Delete', 'Delete this item? This cannot be undone.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await api.delete(`/items/${itemId}`); fetchItems(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={fonts.heading}>My Items</Text>
          <Text style={[fonts.muted, { marginTop: 2, fontWeight: '500' }]}>
            {items.length} item{items.length !== 1 ? 's' : ''} protected
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, showForm && styles.addBtnCancel]}
          onPress={() => setShowForm(!showForm)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name={showForm ? 'close' : 'add'} size={20} color={showForm ? colors.text.secondary : colors.white} />
            <Text style={[styles.addBtnText, showForm && { color: colors.text.secondary }]}>
              {showForm ? 'Cancel' : 'Add'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
            <Ionicons name="cube" size={20} color={colors.primary} />
            <Text style={fonts.subheading}>Register New Item</Text>
          </View>
          <TextInput style={styles.input} placeholder="Item Name (e.g. MacBook)" value={itemName} onChangeText={setItemName} placeholderTextColor={colors.text.muted} />
          <TextInput style={styles.input} placeholder="Description (optional)" value={description} onChangeText={setDescription} placeholderTextColor={colors.text.muted} />
          <TouchableOpacity style={styles.photoBtn} onPress={pickImage} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={20} color={colors.text.muted} />
            <Text style={styles.photoBtnText}>{photo ? 'Change Photo' : 'Choose Photo'}</Text>
          </TouchableOpacity>
          {photo && <Image source={{ uri: photo }} style={styles.preview} />}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
            onPress={handleCreate}
            disabled={submitting}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="qr-code" size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>{submitting ? 'Creating...' : 'Create & Generate QR'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* QR Success Modal */}
      <Modal visible={!!createdItem} transparent animationType="fade" onRequestClose={() => setCreatedItem(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={48} color={colors.accent.green} />
            </View>
            <Text style={[fonts.subheading, { textAlign: 'center' }]}>Item Registered!</Text>
            <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl }]}>
              {createdItem?.itemName} is now protected. Save this QR code.
            </Text>
            {createdItem && (
              <View style={styles.qrContainer}>
                <QRCode
                  value={`${BASE_URL}/found/${createdItem.itemId}`}
                  size={180}
                  color="#1a1a2e"
                  backgroundColor="transparent"
                />
              </View>
            )}
            <Text style={[fonts.muted, { textAlign: 'center', marginTop: spacing.md, fontSize: 11 }]}>
              Scan to return if found
            </Text>
            <TouchableOpacity
              style={[styles.submitBtn, { marginTop: spacing.xl }]}
              onPress={() => setCreatedItem(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.submitBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR View Modal for existing items */}
      <Modal visible={!!showQRFor} transparent animationType="fade" onRequestClose={() => setShowQRFor(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[fonts.subheading, { textAlign: 'center', marginBottom: spacing.lg }]}>
              QR Code: {showQRFor?.itemName}
            </Text>
            {showQRFor && (
              <View style={styles.qrContainer}>
                <QRCode
                  value={`${BASE_URL}/found/${showQRFor.itemId}`}
                  size={200}
                  color="#1a1a2e"
                  backgroundColor="transparent"
                />
              </View>
            )}
            <Text style={[fonts.muted, { textAlign: 'center', marginTop: spacing.md, fontSize: 11 }]}>
               Scan locally to test your item's landing page
            </Text>
            <TouchableOpacity
              style={[styles.submitBtn, { marginTop: spacing.xl }]}
              onPress={() => setShowQRFor(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.submitBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onViewQR={() => setShowQRFor(item)}
            onDelete={() => handleDelete(item.itemId)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchItems}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl * 2 }}>
              <View style={styles.emptyIcon}>
                <Ionicons name="cube-outline" size={64} color={colors.text.muted} />
              </View>
              <Text style={[fonts.subheading, { color: colors.text.secondary }]}>No items yet</Text>
              <Text style={[fonts.muted, { marginTop: spacing.xs }]}>Register your first item above</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: spacing.xxl, paddingBottom: spacing.md },
  addBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  addBtnCancel: { backgroundColor: colors.cream[200] },
  addBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  form: { backgroundColor: colors.pastel.lavenderLight, margin: spacing.xxl, marginTop: 0, borderRadius: radius.lg, padding: spacing.xl, ...shadows.soft },
  input: { backgroundColor: colors.white, borderRadius: radius.sm, padding: spacing.lg, marginBottom: spacing.md, fontSize: 15, borderWidth: 1, borderColor: colors.border, color: colors.text.primary },
  photoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.white, borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  photoBtnText: { color: colors.text.secondary, fontWeight: '500', fontSize: 14 },
  preview: { width: '100%', height: 150, borderRadius: radius.sm, marginBottom: spacing.md },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center' },
  submitBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  list: { padding: spacing.xxl, paddingTop: 0, gap: spacing.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  modalContent: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xxl * 1.5, width: '100%', maxWidth: 360, ...shadows.elevated },
  qrContainer: { alignItems: 'center', backgroundColor: colors.cream[50], borderRadius: radius.md, padding: spacing.xxl },
  successBadge: { alignSelf: 'center', marginBottom: spacing.md },
  emptyIcon: { marginBottom: spacing.lg, opacity: 0.5 },
});

