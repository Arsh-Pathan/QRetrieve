import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, fonts } from '../../constants/theme';
import { BASE_URL } from '../../constants/config';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    // Extract itemId from URL like https://QRetrieve.arsh-io.website/found/{itemId}
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
        <Text style={fonts.regular}>Camera permission is needed to scan QR codes</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
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
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>
      <View style={styles.bottom}>
        <Text style={styles.instructions}>Point camera at a QRetrieve QR code</Text>
        {scanned && (
          <TouchableOpacity style={styles.btn} onPress={() => setScanned(false)}>
            <Text style={styles.btnText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl, backgroundColor: colors.bg },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.md },
  bottom: { position: 'absolute', bottom: 60, left: 0, right: 0, alignItems: 'center' },
  instructions: { color: colors.white, fontSize: 15, marginBottom: spacing.lg },
  btn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  btnText: { color: colors.white, fontWeight: '600', fontSize: 16 },
});
