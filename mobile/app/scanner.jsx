import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../constants/config';
import { colors, spacing, radius, fonts } from '../constants/theme';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    // Check if it's a QRetrieve URL
    const prefix = `${BASE_URL}/found/`;
    if (data.startsWith(prefix)) {
      const itemId = data.replace(prefix, '');
      router.push(`/found/${itemId}`);
    } else if (data.startsWith('http')) {
      // External URL — open in browser
      Linking.openURL(data);
      setTimeout(() => setScanned(false), 2000);
    } else {
      setScanned(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Camera access is needed to scan QR codes</Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnTxt}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarCodeScanned}
      >
        {/* Scan overlay */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <Text style={styles.hint}>Point your camera at a QRetrieve QR code</Text>
            {scanned && (
              <Pressable style={styles.rescanBtn} onPress={() => setScanned(false)}>
                <Text style={styles.rescanTxt}>Tap to Scan Again</Text>
              </Pressable>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const SCAN_SIZE = 250;
const CORNER_SIZE = 30;
const CORNER_WIDTH = 4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  camera: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.bgStart,
  },
  message: { ...fonts.regular, textAlign: 'center', marginBottom: spacing.xl },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  btnTxt: { color: colors.white, fontWeight: '600' },
  overlay: { flex: 1 },
  topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  middleRow: { flexDirection: 'row', height: SCAN_SIZE },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  scanBox: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  hint: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  rescanBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
  },
  rescanTxt: { color: colors.white, fontWeight: '600', fontSize: 13 },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    top: 0, left: 0,
    borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0, right: 0,
    borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderBottomRightRadius: 4,
  },
});
