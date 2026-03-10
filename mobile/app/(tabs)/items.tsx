import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../services/api';
import { colors, spacing, radius, fonts } from '../../constants/theme';
import { ItemCard } from '../../components/ItemCard';

export default function ItemsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      await api.post('/items', formData);
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
    Alert.alert('Delete', 'Delete this item?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await api.delete(`/items/${itemId}`); fetchItems(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={fonts.heading}>My Items</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtnText}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Item Name" value={itemName} onChangeText={setItemName} />
          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
          <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
            <Text style={styles.photoBtnText}>{photo ? 'Change Photo' : 'Add Photo'}</Text>
          </TouchableOpacity>
          {photo && <Image source={{ uri: photo }} style={styles.preview} />}
          <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={submitting}>
            <Text style={styles.submitBtnText}>{submitting ? 'Creating...' : 'Create Item'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ItemCard item={item} onDelete={() => handleDelete(item.itemId)} />}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchItems}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.xxl, paddingBottom: spacing.md },
  addBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  addBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  form: { backgroundColor: colors.white, margin: spacing.xxl, marginTop: 0, borderRadius: radius.md, padding: spacing.xl },
  input: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  photoBtn: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: spacing.md, alignItems: 'center', marginBottom: spacing.sm },
  photoBtnText: { color: colors.text.secondary, fontWeight: '500' },
  preview: { width: '100%', height: 150, borderRadius: radius.sm, marginBottom: spacing.md },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center' },
  submitBtnText: { color: colors.white, fontWeight: '600', fontSize: 16 },
  list: { padding: spacing.xxl, paddingTop: 0, gap: spacing.md },
});
