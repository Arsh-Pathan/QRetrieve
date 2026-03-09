import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { createItem } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import QRGeneratorWidget from '../components/QRGeneratorWidget';
import Card from '../components/Card';
import { colors, spacing, radius, fonts } from '../constants/theme';

export default function RegisterScreen() {
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdItem, setCreatedItem] = useState(null);
  const { showNotification } = useNotification();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await createItem({ ownerName, ownerContact, itemName });
      setCreatedItem(result.item);
      showNotification({
        type: 'success',
        title: 'Item Registered!',
        message: `"${result.item.itemName}" has been registered. Save the QR code below.`,
      });
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Registration Failed',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOwnerName('');
    setOwnerContact('');
    setItemName('');
    setCreatedItem(null);
  };

  const canSubmit = ownerName.trim() && ownerContact.trim() && itemName.trim() && !loading;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.tagline}>Scan it. Find it. Return it.</Text>
          <Text style={styles.subtitle}>
            Register your belongings with a QR code tag. If someone finds your item, they scan and you get notified.
          </Text>
        </View>

        {!createdItem ? (
          <Card>
            <Text style={styles.formTitle}>Register an Item</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={ownerName}
                onChangeText={setOwnerName}
                placeholder="John Doe"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email or Phone</Text>
              <TextInput
                style={styles.input}
                value={ownerContact}
                onChangeText={setOwnerContact}
                placeholder="john@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Blue Backpack, Laptop, Keys..."
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <Pressable
              style={[styles.submitBtn, !canSubmit && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitTxt}>Generate QR Tag</Text>
              )}
            </Pressable>
          </Card>
        ) : (
          <View style={styles.resultSection}>
            <Card style={styles.successBanner}>
              <View style={styles.successRow}>
                <View style={styles.successCheck}>
                  <Text style={styles.successCheckTxt}>✓</Text>
                </View>
                <View style={styles.successText}>
                  <Text style={styles.successTitle}>Item Registered</Text>
                  <Text style={styles.successSub}>Save the QR code and attach it to your item.</Text>
                </View>
              </View>
            </Card>

            <Card>
              <QRGeneratorWidget
                itemId={createdItem.itemId}
                itemName={createdItem.itemName}
              />
            </Card>

            <Pressable style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetTxt}>Register Another Item</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgStart },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: spacing.xxl },
  tagline: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...fonts.small,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
    maxWidth: 320,
  },
  formTitle: { ...fonts.subheading, marginBottom: spacing.xl },
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
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  submitDisabled: { opacity: 0.5 },
  submitTxt: { color: colors.white, fontWeight: '700', fontSize: 16 },
  resultSection: { gap: spacing.lg },
  successBanner: { backgroundColor: 'rgba(46,204,113,0.08)', borderColor: 'rgba(46,204,113,0.2)' },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  successCheck: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCheckTxt: { color: colors.white, fontSize: 20, fontWeight: '800' },
  successText: { flex: 1 },
  successTitle: { ...fonts.subheading, fontSize: 15 },
  successSub: { ...fonts.small, marginTop: 2 },
  resetBtn: {
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.xxl,
  },
  resetTxt: { color: colors.primary, fontWeight: '600', fontSize: 14 },
});
