import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, radius, fonts } from '../constants/theme';

const statusColors: Record<string, string> = {
  safe: colors.accent.green,
  lost: colors.accent.yellow,
  found: colors.accent.blue,
};

interface ItemCardProps {
  item: any;
  onDelete?: () => void;
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.photo} />}
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{item.itemName}</Text>
            <View style={[styles.badge, { backgroundColor: statusColors[item.status] || colors.accent.blue }]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
          {item.description && <Text style={fonts.small} numberOfLines={1}>{item.description}</Text>}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={{ marginTop: spacing.sm }}>
              <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '500' }}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  row: { flexDirection: 'row', gap: spacing.md },
  photo: { width: 60, height: 60, borderRadius: radius.sm },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { ...fonts.regular, fontWeight: '600', flex: 1 },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },
});
