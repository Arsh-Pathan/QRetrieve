import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { colors, spacing, radius, fonts, shadows } from '../../constants/theme';
import { ReportCard } from '../../components/ReportCard';
import { MapView } from '../../components/MapView';

export default function ReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mapReport, setMapReport] = useState<{ lat: number; lng: number; label: string } | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      const res = await api.get<{ reports: any[] }>('/reports');
      setReports(res.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const reportsWithCoords = reports.filter((r) => r.latitude && r.longitude);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={fonts.heading}>Found Reports</Text>
          <Text style={[fonts.muted, { marginTop: 2, fontWeight: '500' }]}>
            {reports.length} report{reports.length !== 1 ? 's' : ''} received
          </Text>
        </View>
        <View style={styles.headerIcon}>
           <Ionicons name="notifications-outline" size={24} color={colors.primary} />
        </View>
      </View>

      {/* Stats */}
      {reports.length > 0 && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.pastel.peachLight }]}>
            <Ionicons name="list" size={18} color={colors.accent.coral} style={{ marginBottom: 4 }} />
            <Text style={styles.statValue}>{reports.length}</Text>
            <Text style={[fonts.caption, { color: colors.text.secondary }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.pastel.blueLight }]}>
            <Ionicons name="location" size={18} color={colors.accent.blue} style={{ marginBottom: 4 }} />
            <Text style={styles.statValue}>{reportsWithCoords.length}</Text>
            <Text style={[fonts.caption, { color: colors.text.secondary }]}>With Location</Text>
          </View>
        </View>
      )}

      {/* Map Overlay */}
      {mapReport && (
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="map" size={16} color={colors.primary} />
              <Text style={[fonts.regular, { fontWeight: '700', fontSize: 14 }]}>Found Location</Text>
            </View>
            <TouchableOpacity onPress={() => setMapReport(null)} style={styles.closeBtn}>
              <Ionicons name="close" size={16} color={colors.text.muted} />
              <Text style={[fonts.muted, { fontSize: 13, fontWeight: '600' }]}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapFrame}>
            <MapView lat={mapReport.lat} lng={mapReport.lng} label={mapReport.label} />
          </View>
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
            style={styles.cardWrapper}
          >
            <ReportCard report={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl * 2 }}>
              <View style={styles.emptyIcon}>
                <Ionicons name="document-text-outline" size={64} color={colors.text.muted} />
              </View>
              <Text style={[fonts.subheading, { color: colors.text.secondary }]}>No reports yet</Text>
              <Text style={[fonts.muted, { marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.xxl }]}>
                When someone finds your item and scans the QR code, their report will appear here.
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.xxl, paddingBottom: spacing.md },
  headerIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.pastel.lavenderLight, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.xxl, marginBottom: spacing.lg },
  statCard: { flex: 1, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', ...shadows.soft },
  statValue: { fontSize: 24, fontWeight: '900', color: colors.text.primary },
  mapContainer: { marginHorizontal: spacing.xxl, marginBottom: spacing.lg, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, ...shadows.card },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  mapFrame: { height: 200, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.cream[100] },
  closeBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.cream[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  list: { padding: spacing.xxl, paddingTop: 0, gap: spacing.md },
  cardWrapper: { marginBottom: spacing.xs },
  emptyIcon: { marginBottom: spacing.lg, opacity: 0.4 },
});
