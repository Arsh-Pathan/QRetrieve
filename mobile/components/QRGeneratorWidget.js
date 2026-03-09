import React, { useState, useRef } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BASE_URL } from '../constants/config';
import { colors, spacing, radius, fonts } from '../constants/theme';

const SIZE_PRESETS = [
  { label: 'Small', desc: 'Sticker', pixels: 128 },
  { label: 'Medium', desc: 'Tag', pixels: 256 },
  { label: 'Large', desc: 'Poster', pixels: 512 },
];

export default function QRGeneratorWidget({ itemId, itemName }) {
  const [selectedPreset, setSelectedPreset] = useState(1);
  const [customSize, setCustomSize] = useState('');
  const [showLabel, setShowLabel] = useState(true);
  const svgRef = useRef(null);

  const qrValue = `${BASE_URL}/found/${itemId}`;

  const getPixelSize = () => {
    if (customSize && Number(customSize) > 0) return Number(customSize);
    return SIZE_PRESETS[selectedPreset].pixels;
  };

  const pixelSize = getPixelSize();
  const previewSize = Math.min(pixelSize, 220);

  const handleDownload = () => {
    if (!svgRef.current) return;
    svgRef.current.toDataURL(async (dataURL) => {
      try {
        const filePath = `${FileSystem.cacheDirectory}qretrieve-${itemId}.png`;
        await FileSystem.writeAsStringAsync(filePath, dataURL, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(filePath, { mimeType: 'image/png' });
      } catch (err) {
        Alert.alert('Error', 'Failed to save QR code');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code for {itemName}</Text>

      {/* QR Preview */}
      <View style={styles.previewWrap}>
        <View style={styles.previewCard}>
          <QRCode
            value={qrValue}
            size={previewSize}
            color="#1a1a2e"
            backgroundColor="#ffffff"
            ecl="H"
            getRef={(ref) => (svgRef.current = ref)}
          />
          {showLabel && (
            <Text style={styles.qrLabel}>Scan to return via QRetrieve</Text>
          )}
        </View>
        <Text style={styles.dimensions}>{pixelSize} × {pixelSize} px</Text>
      </View>

      {/* Size Presets */}
      <Text style={styles.sectionLabel}>SIZE PRESET</Text>
      <View style={styles.presets}>
        {SIZE_PRESETS.map((p, i) => (
          <Pressable
            key={p.label}
            style={[styles.presetBtn, selectedPreset === i && styles.presetActive]}
            onPress={() => { setSelectedPreset(i); setCustomSize(''); }}
          >
            <Text style={[styles.presetLabel, selectedPreset === i && styles.presetLabelActive]}>
              {p.label}
            </Text>
            <Text style={styles.presetDesc}>{p.desc}</Text>
          </Pressable>
        ))}
      </View>

      {/* Custom Size */}
      <Text style={styles.sectionLabel}>CUSTOM SIZE (PX)</Text>
      <TextInput
        style={styles.customInput}
        value={customSize}
        onChangeText={setCustomSize}
        placeholder="e.g. 300"
        placeholderTextColor={colors.textMuted}
        keyboardType="numeric"
      />

      {/* Label Toggle */}
      <Pressable
        style={styles.toggleRow}
        onPress={() => setShowLabel(!showLabel)}
      >
        <View style={[styles.checkbox, showLabel && styles.checkboxChecked]}>
          {showLabel && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.toggleText}>Show label under QR</Text>
      </Pressable>

      {/* Download / Share */}
      <Pressable style={styles.downloadBtn} onPress={handleDownload}>
        <Text style={styles.downloadTxt}>Save & Share QR Code</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl },
  title: { ...fonts.subheading, marginBottom: spacing.xl },
  previewWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  qrLabel: { ...fonts.muted, marginTop: spacing.sm },
  dimensions: { ...fonts.muted, marginTop: spacing.sm },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  presets: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  presetBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  presetActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(108,99,255,0.06)',
  },
  presetLabel: { fontWeight: '600', fontSize: 14, color: colors.textPrimary },
  presetLabelActive: { color: colors.primary },
  presetDesc: { ...fonts.muted, marginTop: 2 },
  customInput: {
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: { color: colors.white, fontSize: 14, fontWeight: '700' },
  toggleText: { ...fonts.small },
  downloadBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  downloadTxt: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
