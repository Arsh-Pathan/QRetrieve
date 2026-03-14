import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';
import { BASE_URL } from '../../constants/config';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const match = data.match(/\/found\/([a-f0-9-]+)/i);
    if (match) {
      router.push(`/found/${match[1]}`);
    } else {
      Alert.alert('Invalid QR', 'This QR code is not a QRetrieve code.', [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name="camera" size={48} color={colors.primary} />
        </View>
        <Text style={[fonts.subheading, { textAlign: 'center' }]}>Camera Permission</Text>
        <Text style={[fonts.small, { textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl, color: colors.text.muted }]}>
          Camera access is needed to scan QR codes and return lost items.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission} activeOpacity={0.7}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanBox}>
          {/* Corner accents */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
      </View>
      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
            <Ionicons name="qr-code" size={18} color={colors.white} />
            <Text style={styles.instructions}>Point at a QRetrieve QR code</Text>
          </View>
          {scanned && (
            <TouchableOpacity style={styles.btn} onPress={() => setScanned(false)} activeOpacity={0.7}>
              <Text style={styles.btnText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl * 2, backgroundColor: colors.bg },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.pastel.lavenderLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanBox: {
    width: 260, height: 260,
    borderRadius: radius.md,
    position: 'relative',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  corner: {
    position: 'absolute',
    width: 40, height: 40,
    borderColor: colors.primary,
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 6, borderLeftWidth: 6, borderTopLeftRadius: radius.md },
  cornerTR: { top: -2, right: -2, borderTopWidth: 6, borderRightWidth: 6, borderTopRightRadius: radius.md },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 6, borderLeftWidth: 6, borderBottomLeftRadius: radius.md },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 6, borderRightWidth: 6, borderBottomRightRadius: radius.md },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingBottom: 40,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  bottomContent: { alignItems: 'center', paddingVertical: spacing.xl },
  instructions: { color: colors.white, fontSize: 16, fontWeight: '600' },
  btn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, ...shadows.soft },
  btnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
