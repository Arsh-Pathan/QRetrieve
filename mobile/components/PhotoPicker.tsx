import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius } from '../constants/theme';

interface PhotoPickerProps {
  uri: string | null;
  onPick: (uri: string) => void;
  useCamera?: boolean;
}

export function PhotoPicker({ uri, onPick, useCamera = false }: PhotoPickerProps) {
  const pick = async () => {
    const fn = useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await fn({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) onPick(result.assets[0].uri);
  };

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={pick}>
        <Text style={styles.btnText}>{uri ? 'Change Photo' : useCamera ? 'Take Photo' : 'Choose Photo'}</Text>
      </TouchableOpacity>
      {uri && <Image source={{ uri }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: colors.bg, borderRadius: radius.sm, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnText: { color: colors.text.secondary, fontWeight: '500' },
  preview: { width: '100%', height: 150, borderRadius: radius.sm, marginTop: spacing.sm },
});
