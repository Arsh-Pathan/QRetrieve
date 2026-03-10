import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE } from '../../constants/config';
import { colors, spacing, radius, fonts } from '../../constants/theme';

export default function FoundItemScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ finderName: '', finderContact: '', finderLocation: '', message: '' });
  const [photo, setPhoto] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/finder/${itemId}`)
      .then((r) => r.json())
      .then(setItem)
      .catch(() => setError('Item not found'));
  }, [itemId]);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission denied');
    const loc = await Location.getCurrentPositionAsync();
    setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    const [addr] = await Location.reverseGeocodeAsync(loc.coords);
    if (addr) {
      setForm((f) => ({ ...f, finderLocation: `${addr.street || ''} ${addr.city || ''} ${addr.region || ''}`.trim() }));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!form.finderName || !form.finderLocation) return Alert.alert('Please fill required fields');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('finderName', form.finderName);
      formData.append('finderContact', form.finderContact);
      formData.append('finderLocation', form.finderLocation);
      if (form.message) formData.append('message', form.message);
      if (coords) {
        formData.append('latitude', coords.lat.toString());
        formData.append('longitude', coords.lng.toString());
      }
      if (photo) {
        const ext = photo.split('.').pop() || 'jpg';
        formData.append('photo', { uri: photo, name: `photo.${ext}`, type: `image/${ext}` } as any);
      }
      const res = await fetch(`${API_BASE}/finder/${itemId}/report`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <View style={styles.center}><Text style={{ color: colors.danger }}>{error}</Text></View>;
  if (submitted) return <View style={styles.center}><Text style={fonts.heading}>Thank you!</Text><Text style={fonts.small}>The owner has been notified.</Text></View>;
  if (!item) return <View style={styles.center}><Text style={fonts.muted}>Loading...</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.itemPhoto} />}
        <Text style={fonts.subheading}>{item.itemName}</Text>
        {item.description && <Text style={[fonts.small, { marginTop: spacing.xs }]}>{item.description}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={[fonts.subheading, { marginBottom: spacing.lg }]}>Report Found</Text>
        <TextInput style={styles.input} placeholder="Your Name *" value={form.finderName} onChangeText={(v) => setForm((f) => ({ ...f, finderName: v }))} />
        <TextInput style={styles.input} placeholder="Contact (email/phone)" value={form.finderContact} onChangeText={(v) => setForm((f) => ({ ...f, finderContact: v }))} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Location *" value={form.finderLocation} onChangeText={(v) => setForm((f) => ({ ...f, finderLocation: v }))} />
          <TouchableOpacity style={styles.gpsBtn} onPress={getLocation}><Text style={{ color: colors.white, fontWeight: '600' }}>GPS</Text></TouchableOpacity>
        </View>
        <TextInput style={styles.input} placeholder="Message (optional)" value={form.message} onChangeText={(v) => setForm((f) => ({ ...f, message: v }))} multiline />
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}><Text style={{ color: colors.text.secondary }}>Take Photo</Text></TouchableOpacity>
        {photo && <Image source={{ uri: photo }} style={styles.preview} />}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Report'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xxl, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl, backgroundColor: colors.bg },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.xxl, marginBottom: spacing.lg, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  itemPhoto: { width: '100%', height: 180, borderRadius: radius.sm, marginBottom: spacing.md },
  input: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  gpsBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, justifyContent: 'center', marginBottom: spacing.md },
  photoBtn: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  preview: { width: '100%', height: 150, borderRadius: radius.sm, marginBottom: spacing.md },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, padding: spacing.lg, alignItems: 'center' },
  submitText: { color: colors.white, fontWeight: '600', fontSize: 16 },
});
