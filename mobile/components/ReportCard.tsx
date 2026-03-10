import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, radius, fonts } from '../constants/theme';

interface ReportCardProps {
  report: any;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{report.finderName}</Text>
        <Text style={fonts.muted}>{new Date(report.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={fonts.small}>📍 {report.finderLocation}</Text>
      {report.message && <Text style={[fonts.small, { marginTop: spacing.xs }]}>{report.message}</Text>}
      {report.photoUrl && <Image source={{ uri: report.photoUrl }} style={styles.photo} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  name: { ...fonts.regular, fontWeight: '600' },
  photo: { width: '100%', height: 150, borderRadius: radius.sm, marginTop: spacing.md },
});
