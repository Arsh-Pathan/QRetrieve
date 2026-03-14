import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
            <Text style={[fonts.caption, { color: colors.text.muted }]}>
              {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={12} color={colors.accent.blue} />
            <Text style={[fonts.small, { flex: 1, color: colors.text.secondary }]} numberOfLines={1}>{report.finderLocation}</Text>
          </View>
          {report.message && (
            <View style={styles.messageBubble}>
              <Text style={[fonts.muted, { fontStyle: 'italic', fontSize: 13, color: colors.text.secondary }]}>"{report.message}"</Text>
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
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  row: { flexDirection: 'row', gap: spacing.md },
  avatar: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.pastel.peachLight,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: colors.accent.coral },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...fonts.regular, fontWeight: '700', fontSize: 15, color: colors.text.primary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  messageBubble: {
    backgroundColor: colors.cream[50],
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.blue + '40',
  },
  photo: { width: '100%', height: 160, borderRadius: radius.md, marginTop: spacing.md },
});
