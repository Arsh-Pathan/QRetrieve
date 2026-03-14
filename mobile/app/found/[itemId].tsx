import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
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
        <View style={styles.errorIcon}>
          <Ionicons name="alert-circle" size={48} color={colors.accent.red} />
        </View>
        <Text style={[fonts.subheading, { textAlign: 'center' }]}>Oops!</Text>
        <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm }]}>{error}</Text>
      </View>
    );
  }

  if (submitted) {
    return (
      <View style={styles.center}>
        <View style={styles.successIcon}>
          <Ionicons name="happy" size={64} color={colors.accent.green} />
        </View>
        <Text style={[fonts.heading, { textAlign: 'center' }]}>Thank You!</Text>
        <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm }]}>
          The owner has been notified instantly. They'll reach out to arrange pickup.
        </Text>
        <View style={styles.successBanner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Ionicons name="checkmark-circle" size={18} color="#2e7d32" />
            <Text style={styles.successTitle}>Your good deed matters!</Text>
          </View>
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
        <View style={styles.headerCircle}>
          <Ionicons name="cube" size={42} color={colors.primary} />
        </View>
        <Text style={[fonts.heading, { textAlign: 'center' }]}>Someone Lost This Item</Text>
        <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm }]}>
          Thanks for scanning! Help return it by filling out a quick form.
        </Text>
      </View>

      {/* Trust badges */}
      <View style={styles.trustRow}>
        {[
          { icon: 'shield-checkmark', label: 'Secure', color: colors.accent.green },
          { icon: 'lock-closed', label: 'Private', color: colors.accent.blue },
          { icon: 'flash', label: 'Instant', color: colors.accent.yellow }
        ].map((badge) => (
          <View key={badge.label} style={styles.trustBadge}>
            <Ionicons name={badge.icon as any} size={14} color={badge.color} />
            <Text style={styles.trustText}>{badge.label}</Text>
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
              <Ionicons name="cube-outline" size={32} color={colors.primary} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[fonts.caption, { color: colors.primary, fontWeight: '700' }]}>FOUND ITEM</Text>
            <Text style={[fonts.subheading, { marginTop: 2 }]}>{item.itemName}</Text>
            {item.description && (
              <Text style={[fonts.small, { marginTop: spacing.xs }]} numberOfLines={2}>{item.description}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 }}>
          <Ionicons name="document-text" size={18} color={colors.accent.coral} />
          <Text style={fonts.subheading}>Quick Report</Text>
        </View>
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
            <Ionicons name="location" size={16} color={colors.white} />
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
          <Ionicons name="camera" size={20} color={colors.text.muted} />
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="checkmark" size={20} color={colors.white} />
            <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Report Item Found'}</Text>
          </View>
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
  errorIcon: { width: 80, height: 80, borderRadius: radius.xl, backgroundColor: colors.pastel.peachLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  successIcon: { marginBottom: spacing.lg },
  headerArea: { paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg, backgroundColor: colors.pastel.lavenderLight, borderRadius: radius.xl, marginBottom: spacing.lg, alignItems: 'center' },
  headerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md, ...shadows.soft },
  trustRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  trustBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.white, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...shadows.soft },
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
  successBanner: { backgroundColor: colors.pastel.sageLight, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.xxl, width: '100%' },
  successTitle: { fontWeight: '700', color: '#2e7d32', fontSize: 14 },
  successSub: { fontSize: 12, color: '#2e7d32', opacity: 0.8, marginTop: 2, paddingLeft: 24 },
});

