import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useGeolocation } from '../hooks/useGeolocation';
import { colors, spacing, radius, fonts } from '../constants/theme';

export default function FoundReportForm({ itemId, itemName, onSubmit, isSubmitting }) {
  const [finderName, setFinderName] = useState('');
  const [finderContact, setFinderContact] = useState('');
  const [message, setMessage] = useState('');
  const { location, loading: geoLoading, getLocation, setLocation } = useGeolocation();

  const handleSubmit = () => {
    onSubmit({
      itemId,
      finderName,
      finderLocation: location,
      finderContact,
      message,
    });
  };

  const canSubmit = finderName.trim() && location.trim() && !isSubmitting;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>📍</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>This item is registered on QRetrieve</Text>
          <Text style={styles.subtitle}>
            If you found <Text style={styles.bold}>{itemName}</Text>, please help return it.
          </Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Your Name *</Text>
        <TextInput
          style={styles.input}
          value={finderName}
          onChangeText={setFinderName}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Current Location *</Text>
        <View style={styles.locationRow}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={location}
            onChangeText={setLocation}
            placeholder="Where did you find this item?"
            placeholderTextColor={colors.textMuted}
          />
          <Pressable
            style={[styles.geoBtn, geoLoading && styles.geoBtnDisabled]}
            onPress={getLocation}
            disabled={geoLoading}
          >
            {geoLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.geoBtnTxt}>GPS</Text>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone or Email (optional)</Text>
        <TextInput
          style={styles.input}
          value={finderContact}
          onChangeText={setFinderContact}
          placeholder="So the owner can reach you"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Message (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder="Any additional details..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <Pressable
        style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.submitTxt}>Report Item Found</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 24 },
  headerText: { flex: 1 },
  title: { ...fonts.subheading, marginBottom: 4 },
  subtitle: { ...fonts.small, lineHeight: 20 },
  bold: { fontWeight: '700', color: colors.textPrimary },
  field: { marginBottom: spacing.lg + 2 },
  label: { ...fonts.label, marginBottom: spacing.xs + 2 },
  input: {
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  textArea: { minHeight: 80, paddingTop: spacing.md },
  locationRow: { flexDirection: 'row', gap: spacing.sm },
  locationInput: { flex: 1 },
  geoBtn: {
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  geoBtnDisabled: { opacity: 0.6 },
  geoBtnTxt: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  submitBtn: {
    backgroundColor: colors.success,
    borderRadius: radius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    elevation: 4,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitTxt: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
