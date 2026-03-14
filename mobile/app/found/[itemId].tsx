import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE } from '../../constants/config';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';

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
    // Auto-detect location
    getLocation();
  }, [itemId]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync();
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      const [addr] = await Location.reverseGeocodeAsync(loc.coords);
      if (addr) {
        setForm((f) => ({ ...f, finderLocation: `${addr.street || ''} ${addr.city || ''} ${addr.region || ''}`.trim() }));
      }
    } catch (err) {
      console.log('Location error:', err);
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: spacing.md }}>😕</Text>
        <Text style={[fonts.subheading, { textAlign: 'center' }]}>Oops!</Text>
        <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm }]}>{error}</Text>
      </View>
    );
  }

  if (submitted) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: spacing.md }}>🎉</Text>
        <Text style={[fonts.heading, { textAlign: 'center' }]}>Thank You!</Text>
        <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm }]}>
          The owner has been notified instantly. They'll reach out to arrange pickup.
        </Text>
        <View style={styles.successBanner}>
          <Text style={styles.successTitle}>Your good deed matters!</Text>
          <Text style={styles.successSub}>The owner will be incredibly grateful.</Text>
        </View>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={fonts.muted}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerArea}>
        <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: spacing.md }}>📦</Text>
        <Text style={[fonts.heading, { textAlign: 'center' }]}>Someone Lost This Item</Text>
        <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm }]}>
          Thanks for scanning! Help return it by filling out a quick form.
        </Text>
      </View>

      {/* Trust badges */}
      <View style={styles.trustRow}>
        {['🛡️ Secure', '🔒 Private', '⚡ Instant'].map((badge) => (
          <View key={badge} style={styles.trustBadge}>
            <Text style={styles.trustText}>{badge}</Text>
          </View>
        ))}
      </View>

      {/* Item info */}
      <View style={styles.card}>
        <View style={styles.itemRow}>
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} style={styles.itemPhoto} />
          ) : (
            <View style={styles.itemPlaceholder}>
              <Text style={{ fontSize: 28 }}>📦</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={fonts.caption}>FOUND ITEM</Text>
            <Text style={[fonts.subheading, { marginTop: 2 }]}>{item.itemName}</Text>
            {item.description && (
              <Text style={[fonts.small, { marginTop: spacing.xs }]}>{item.description}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={[fonts.subheading, { marginBottom: 2 }]}>📝 Quick Report</Text>
        <Text style={[fonts.muted, { marginBottom: spacing.lg }]}>Takes less than 30 seconds</Text>

        <TextInput
          style={styles.input}
          placeholder="Your Name *"
          value={form.finderName}
          onChangeText={(v) => setForm((f) => ({ ...f, finderName: v }))}
          placeholderTextColor={colors.text.muted}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact (email/phone)"
          value={form.finderContact}
          onChangeText={(v) => setForm((f) => ({ ...f, finderContact: v }))}
          placeholderTextColor={colors.text.muted}
        />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Location *"
            value={form.finderLocation}
            onChangeText={(v) => setForm((f) => ({ ...f, finderLocation: v }))}
            placeholderTextColor={colors.text.muted}
          />
          <TouchableOpacity style={styles.gpsBtn} onPress={getLocation} activeOpacity={0.7}>
            <Text style={{ color: colors.white, fontWeight: '700', fontSize: 13 }}>📍</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Message (optional)"
          value={form.message}
          onChangeText={(v) => setForm((f) => ({ ...f, message: v }))}
          multiline
          placeholderTextColor={colors.text.muted}
        />
        <TouchableOpacity style={styles.cameraBtn} onPress={pickImage} activeOpacity={0.7}>
          <Text style={{ fontSize: 16 }}>📷</Text>
          <Text style={{ color: colors.text.secondary, fontWeight: '500' }}>
            {photo ? 'Change Photo' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
        {photo && <Image source={{ uri: photo }} style={styles.preview} />}

        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.7}
        >
          <Text style={styles.submitText}>{submitting ? 'Submitting...' : '🎉 Report Item Found'}</Text>
        </TouchableOpacity>

        <Text style={[fonts.caption, { textAlign: 'center', marginTop: spacing.md }]}>
          Your information is only shared with the item's owner.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xxl, backgroundColor: colors.bg, paddingBottom: spacing.xxxl * 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl * 2, backgroundColor: colors.bg },
  headerArea: { paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg, backgroundColor: colors.pastel.lavenderLight, borderRadius: radius.xl, marginBottom: spacing.lg },
  trustRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  trustBadge: { backgroundColor: colors.white, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...shadows.soft },
  trustText: { fontSize: 12, fontWeight: '600', color: colors.text.secondary },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xxl, marginBottom: spacing.lg, ...shadows.card },
  itemRow: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  itemPhoto: { width: 70, height: 70, borderRadius: radius.md },
  itemPlaceholder: { width: 70, height: 70, borderRadius: radius.md, backgroundColor: colors.pastel.lavenderLight, justifyContent: 'center', alignItems: 'center' },
  input: { backgroundColor: colors.cream[50], borderRadius: radius.sm, padding: spacing.lg, marginBottom: spacing.md, fontSize: 15, borderWidth: 1, borderColor: colors.border, color: colors.text.primary },
  gpsBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, justifyContent: 'center', marginBottom: spacing.md },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.cream[50], borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.md, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  preview: { width: '100%', height: 150, borderRadius: radius.sm, marginBottom: spacing.md },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.sm, padding: spacing.lg + 2, alignItems: 'center' },
  submitText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  successBanner: { backgroundColor: colors.pastel.sageLight, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.xxl },
  successTitle: { fontWeight: '700', color: '#2e7d32', fontSize: 14 },
  successSub: { fontSize: 12, color: '#2e7d32', opacity: 0.8, marginTop: 2 },
});
