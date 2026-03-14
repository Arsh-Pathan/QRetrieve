import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, radius, fonts, shadows } from '../constants/theme';

const statusConfig: Record<string, { bg: string; text: string }> = {
  safe: { bg: colors.pastel.sageLight, text: '#2e7d32' },
  lost: { bg: colors.pastel.peachLight, text: '#c62828' },
  found: { bg: colors.pastel.blueLight, text: '#1565c0' },
};

interface ItemCardProps {
  item: any;
  onViewQR?: () => void;
  onDelete?: () => void;
}

export function ItemCard({ item, onViewQR, onDelete }: ItemCardProps) {
  const status = statusConfig[item.status] || statusConfig.safe;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ fontSize: 22 }}>📱</Text>
          </View>
        )}
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{item.itemName}</Text>
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Text style={[styles.badgeText, { color: status.text }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          {item.description && (
            <Text style={fonts.muted} numberOfLines={1}>{item.description}</Text>
          )}
          <View style={styles.actions}>
            {onViewQR && (
              <TouchableOpacity style={styles.qrBtn} onPress={onViewQR} activeOpacity={0.7}>
                <Text style={styles.qrBtnText}>⊞ QR Code</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={{ marginLeft: spacing.md }}>
                <Text style={{ color: colors.text.muted, fontSize: 12, fontWeight: '500' }}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  row: { flexDirection: 'row', gap: spacing.md },
  photo: { width: 56, height: 56, borderRadius: radius.md },
  placeholder: {
    width: 56, height: 56, borderRadius: radius.md,
    backgroundColor: colors.pastel.lavenderLight,
    justifyContent: 'center', alignItems: 'center',
  },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { ...fonts.regular, fontWeight: '600', flex: 1 },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  qrBtn: {
    backgroundColor: colors.pastel.lavenderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  qrBtnText: { fontSize: 12, fontWeight: '600', color: colors.primary },
});
