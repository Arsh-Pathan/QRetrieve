import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, fonts } from '../constants/theme';

interface PhotoPickerProps {
  uri: string | null;
  onPick: (uri: string) => void;
  useCamera?: boolean;
}

export function PhotoPicker({ uri, onPick, useCamera = false }: PhotoPickerProps) {
  const pick = async () => {
    const fn = useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await fn({ 
      mediaTypes: ['images'], 
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) onPick(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={pick} activeOpacity={0.7}>
        <Text style={{ fontSize: 20, marginBottom: 4 }}>📷</Text>
        <Text style={styles.btnText}>{uri ? 'Change Photo' : useCamera ? 'Take Photo' : 'Choose Photo'}</Text>
      </TouchableOpacity>
      {uri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri }} style={styles.preview} />
          <TouchableOpacity 
            style={styles.removeBtn} 
            onPress={() => onPick('')}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  btn: { 
    backgroundColor: colors.cream[50], 
    borderRadius: radius.md, 
    padding: spacing.xl, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: colors.border, 
    borderStyle: 'dashed',
    marginTop: spacing.sm,
  },
  btnText: { color: colors.text.secondary, fontWeight: '600', fontSize: 14 },
  previewContainer: { marginTop: spacing.md, position: 'relative' },
  preview: { 
    width: '100%', 
    height: 200, 
    borderRadius: radius.md, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  }
});
