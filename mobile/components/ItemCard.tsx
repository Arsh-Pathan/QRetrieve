import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts, shadows } from '../constants/theme';

const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
  safe: { bg: colors.pastel.sageLight, text: '#2e7d32', icon: 'shield-checkmark' },
  lost: { bg: colors.pastel.peachLight, text: '#c62828', icon: 'alert-circle' },
  found: { bg: colors.pastel.blueLight, text: '#1565c0', icon: 'location' },
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
            <Ionicons name="cube" size={24} color={colors.primary} />
          </View>
        )}
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{item.itemName}</Text>
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon} size={10} color={status.text} />
              <Text style={[styles.badgeText, { color: status.text }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          {item.description && (
            <Text style={[fonts.muted, { marginTop: 2 }]} numberOfLines={1}>{item.description}</Text>
          )}
          <View style={styles.actions}>
            {onViewQR && (
              <TouchableOpacity style={styles.qrBtn} onPress={onViewQR} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="qr-code-outline" size={14} color={colors.primary} />
                    <Text style={styles.qrBtnText}>View QR</Text>
                </View>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={14} color={colors.text.muted} />
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
  name: { ...fonts.regular, fontWeight: '700', flex: 1 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 9, fontWeight: '800' },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  qrBtn: {
    backgroundColor: colors.pastel.lavenderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  qrBtnText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: spacing.lg },
});
