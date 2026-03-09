import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, fonts } from '../constants/theme';

export default function ReportCard({ report }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>Found Report</Text>
        </View>
        <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
      </View>

      <View style={styles.details}>
        <DetailRow label="Item ID" value={report.itemId} mono />
        <DetailRow label="Finder" value={report.finderName} />
        <DetailRow label="Location" value={report.finderLocation} />
        {report.finderContact ? (
          <DetailRow label="Contact" value={report.finderContact} />
        ) : null}
        {report.message ? (
          <DetailRow label="Message" value={report.message} />
        ) : null}
      </View>
    </View>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, mono && styles.mono]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeTxt: { color: colors.white, fontSize: 11, fontWeight: '700' },
  date: { ...fonts.muted },
  details: { gap: spacing.xs },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: spacing.xs + 2,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    maxWidth: '60%',
  },
  mono: { fontFamily: 'monospace', fontSize: 12 },
});
