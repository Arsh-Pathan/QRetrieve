import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';
import { ReportCard } from '../../components/ReportCard';
import { MapView } from '../../components/MapView';

export default function ReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReport, setMapReport] = useState<{ lat: number; lng: number; label: string } | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      const res = await api.get<{ reports: any[] }>('/reports');
      setReports(res.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const reportsWithCoords = reports.filter((r) => r.latitude && r.longitude);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={fonts.heading}>Found Reports</Text>
        <Text style={[fonts.muted, { marginTop: 2 }]}>
          {reports.length} report{reports.length !== 1 ? 's' : ''} received
        </Text>
      </View>

      {/* Stats */}
      {reports.length > 0 && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.pastel.peachLight }]}>
            <Text style={styles.statValue}>{reports.length}</Text>
            <Text style={fonts.caption}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.pastel.blueLight }]}>
            <Text style={styles.statValue}>{reportsWithCoords.length}</Text>
            <Text style={fonts.caption}>With Location</Text>
          </View>
        </View>
      )}

      {/* Map */}
      {mapReport && (
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Text style={[fonts.regular, { fontWeight: '600', fontSize: 14 }]}>🗺️ Found Location</Text>
            <TouchableOpacity onPress={() => setMapReport(null)}>
              <Text style={[fonts.muted, { fontSize: 13 }]}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <MapView lat={mapReport.lat} lng={mapReport.lng} label={mapReport.label} />
        </View>
      )}

      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (item.latitude && item.longitude) {
                setMapReport({ lat: item.latitude, lng: item.longitude, label: item.finderLocation });
              }
            }}
          >
            <ReportCard report={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchReports}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl * 2 }}>
              <Text style={{ fontSize: 48, marginBottom: spacing.md }}>📋</Text>
              <Text style={[fonts.subheading, { color: colors.text.secondary }]}>No reports yet</Text>
              <Text style={[fonts.muted, { marginTop: spacing.xs, textAlign: 'center' }]}>
                Reports appear when someone scans your QR code
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.xxl, paddingBottom: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.xxl, marginBottom: spacing.md },
  statCard: { flex: 1, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', ...shadows.soft },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text.primary },
  mapContainer: { marginHorizontal: spacing.xxl, marginBottom: spacing.md },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  list: { padding: spacing.xxl, paddingTop: 0, gap: spacing.md },
});
