import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, radius, fonts, shadows } from '../constants/theme';

interface ReportCardProps {
  report: any;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {report.finderName?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.name}>{report.finderName}</Text>
            <Text style={fonts.caption}>
              {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={{ fontSize: 12 }}>📍</Text>
            <Text style={[fonts.small, { flex: 1 }]} numberOfLines={1}>{report.finderLocation}</Text>
          </View>
          {report.message && (
            <View style={styles.messageBubble}>
              <Text style={[fonts.muted, { fontStyle: 'italic' }]}>"{report.message}"</Text>
            </View>
          )}
          {report.photoUrl && (
            <Image source={{ uri: report.photoUrl }} style={styles.photo} />
          )}
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
  avatar: {
    width: 40, height: 40, borderRadius: radius.sm,
    backgroundColor: colors.pastel.peachLight,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: colors.accent.coral },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...fonts.regular, fontWeight: '600', fontSize: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  messageBubble: {
    backgroundColor: colors.cream[50],
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  photo: { width: '100%', height: 140, borderRadius: radius.sm, marginTop: spacing.md },
});
